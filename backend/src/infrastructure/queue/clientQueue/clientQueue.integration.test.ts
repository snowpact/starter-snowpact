import { describe, it, expect, beforeAll } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { testQueueService } from '@/configuration/tests/vitest.containers.setup';
import { QueueName } from '@/domain/enums/queues.enum';

import { ClientQueueInterface } from './clientQueue.interface';

describe('ClientQueue Integration', () => {
  let clientQueue: ClientQueueInterface;
  beforeAll(() => {
    clientQueue = mainContainer.get<ClientQueueInterface>(TYPES.ClientQueue);
  });

  describe('createQueue', () => {
    it('should create a new queue', async () => {
      const queueName = 'test-create-queue';
      await clientQueue.createQueue(queueName);
      const queues = await testQueueService.boss.getQueues();
      expect(queues.map((queue) => queue.name)).toContain(queueName);
    });
  });

  describe('createQueue', () => {
    it('should create a new queue if it does not exist', async () => {
      const existingQueueName = 'existing-queue';
      await testQueueService.boss.createQueue(existingQueueName);
      await clientQueue.createQueue(QueueName.SEND_EMAIL);
      const queues = await testQueueService.boss.getQueues();
      expect(queues.map((queue) => queue.name)).toContain('existing-queue');
      expect(queues.map((queue) => queue.name)).toContain(QueueName.SEND_EMAIL);
    });

    it('should not create a queue if it already exists', async () => {
      await testQueueService.boss.createQueue(QueueName.SEND_EMAIL);
      await clientQueue.createQueue(QueueName.SEND_EMAIL);
      const queues = await testQueueService.boss.getQueues();
      expect(queues.map((queue) => queue.name)).toContain(QueueName.SEND_EMAIL);
      expect(queues.length).toBe(1);
    });
  });

  describe('setupAllQueues', () => {
    it('should create all queues', async () => {
      const existingQueues = ['test-queue-1', 'test-queue-2'];
      for (const queue of existingQueues) {
        await testQueueService.boss.createQueue(queue);
      }
      await clientQueue.setupAllQueues();
      const queues = await testQueueService.boss.getQueues();
      expect(queues.length).toBe(existingQueues.length + Object.values(QueueName).length);
      Object.values(QueueName).forEach((queue) => {
        expect(queues.map((queue) => queue.name)).toContain(queue);
      });
    });
  });

  describe('removeQueue', () => {
    it('should remove a queue', async () => {
      const queueName = 'test-remove-queue';
      await testQueueService.boss.createQueue(queueName);
      await clientQueue.removeQueue(queueName);
      const queues = await testQueueService.boss.getQueues();
      expect(queues).not.toContain(queueName);
    });
  });

  describe('sendJob', () => {
    it('should send a job to a queue', async () => {
      const queueName = 'test-send-job-queue';
      const jobData = { test: 'data' };
      await testQueueService.boss.createQueue(queueName);
      const jobId = await clientQueue.sendJob(queueName, jobData);

      expect(jobId).not.toBeNull();
      if (!jobId) {
        throw new Error('Job ID is null');
      }

      const job = await testQueueService.boss.getJobById(queueName, jobId);
      expect(job).not.toBeNull();
      expect(job?.data).toEqual(jobData);
    });
  });

  describe('scheduleCron', () => {
    it('should schedule a cron job', async () => {
      const scheduleName = 'test-schedule-cron';
      const cronTime = '*/5 * * * *';
      const data = { test: 'schedule-data' };
      await clientQueue.createQueue(scheduleName);

      await clientQueue.scheduleCron({ queue: scheduleName, cronTime, data });

      const schedules = await testQueueService.boss.getSchedules();
      expect(schedules.map((schedule) => schedule.name)).toContain(scheduleName);
    });
  });

  describe('removeOldSchedules', () => {
    it('should remove old schedules except the active one', async () => {
      const activeCron = ['active-cron'];
      const allSchedules = ['old-cron-1', 'active-cron', 'old-cron-2'];
      for (const schedule of activeCron) {
        await testQueueService.boss.createQueue(schedule);
      }
      for (const schedule of allSchedules) {
        await testQueueService.boss.createQueue(schedule);
      }
      await Promise.all(
        allSchedules.map((schedule) =>
          testQueueService.boss.schedule(schedule, '*/5 * * * *', { test: 'schedule-data' }),
        ),
      );

      await clientQueue.removeOldSchedules(activeCron);

      const schedules = await testQueueService.boss.getSchedules();
      expect(schedules.length).toBe(1);
      expect(schedules[0].name).toBe(activeCron[0]);
    });

    it('should not remove any schedules if only the active one exists', async () => {
      const activeCron = ['active-cron'];
      const allSchedules = ['active-cron'];
      await Promise.all(activeCron.map((schedule) => testQueueService.boss.createQueue(schedule)));
      await Promise.all(
        allSchedules.map((schedule) =>
          testQueueService.boss.schedule(schedule, '*/5 * * * *', { test: 'schedule-data' }),
        ),
      );

      await clientQueue.removeOldSchedules(activeCron);

      const schedules = await testQueueService.boss.getSchedules();
      expect(schedules.length).toBe(1);
      expect(schedules[0].name).toBe(activeCron[0]);
    });
  });

  describe('removeSchedule', () => {
    it('should remove a schedule', async () => {
      const scheduleName = 'test-remove-schedule';
      const cronTime = '*/5 * * * *';
      const data = { test: 'schedule-data' };
      await testQueueService.boss.createQueue(scheduleName);
      await testQueueService.boss.schedule(scheduleName, cronTime, data);

      await clientQueue.removeSchedule(scheduleName);

      const schedules = await testQueueService.boss.getSchedules();
      expect(schedules.map((schedule) => schedule.name)).not.toContain(scheduleName);
    });
  });

  describe('getAllScheduleIds', () => {
    it('should return all schedule IDs', async () => {
      const scheduleName1 = 'test-schedule-1';
      const scheduleName2 = 'test-schedule-2';
      const cronTime = '*/5 * * * *';
      const data = { test: 'schedule-data' };
      await testQueueService.boss.createQueue(scheduleName1);
      await testQueueService.boss.createQueue(scheduleName2);

      await testQueueService.boss.schedule(scheduleName1, cronTime, data);
      await testQueueService.boss.schedule(scheduleName2, cronTime, data);

      const schedules = await clientQueue.getAllScheduleIds();
      expect(schedules).toContain(scheduleName1);
      expect(schedules).toContain(scheduleName2);
    });
  });

  describe('setupWorker', () => {
    it('should set up a worker to process jobs', async () => {
      const queueName = 'test-setup-worker-queue';
      const jobData = { test: 'worker-data' };
      await testQueueService.boss.createQueue(queueName);

      let receivedJob: boolean = false;
      await clientQueue.setupWorker(queueName, async () => {
        await Promise.resolve();
        receivedJob = true;
      });

      await testQueueService.boss.send(queueName, jobData);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      expect(receivedJob).toBe(true);
    });
  });
});

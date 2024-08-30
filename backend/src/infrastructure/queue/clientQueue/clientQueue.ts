import { inject, injectable } from 'inversify';
import { DatabaseError } from 'pg';
import PgBoss from 'pg-boss';

import { LoggerInterface } from '@/domain/interfaces/logger.interface';

import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

import { ClientQueueInterface, ScheduleCronOptions } from './clientQueue.interface';

@injectable()
export class ClientQueue implements ClientQueueInterface {
  private boss: PgBoss;
  constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {}

  async start(dbUrl: string): Promise<void> {
    this.boss = new PgBoss({
      connectionString: dbUrl,
    });
    await this.boss.start();
    this.logger.debug('PgBossClient started');
  }

  async stop(): Promise<void> {
    await this.boss.stop({ graceful: true });
    this.logger.debug('PgBossClient stopped');
  }

  async createQueue(queueName: string): Promise<void> {
    try {
      await this.boss.createQueue(queueName);
      this.logger.debug(`Queue ${queueName} created`);
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.table !== 'queue' || error.routine !== '_bt_check_unique') {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  async setupAllQueues(): Promise<void> {
    const queues = Object.values(QueueName);
    for (const queue of queues) {
      await this.createQueue(queue);
    }
  }

  async removeQueue(queue: string): Promise<void> {
    await this.boss.deleteQueue(queue);
    this.logger.debug(`Queue ${queue} removed`);
  }

  async sendJob(queue: string, data: object): Promise<string | null> {
    const jobId = await this.boss.send(queue, data);
    this.logger.debug(`Job sent to queue ${queue}`);
    return jobId;
  }

  async scheduleCron({ queue, cronTime, data }: ScheduleCronOptions): Promise<void> {
    await this.boss.schedule(queue, cronTime, data);
    this.logger.debug(`Job scheduled to queue ${queue} with cron ${cronTime}`);
  }

  async removeSchedule(scheduleName: string): Promise<void> {
    await this.boss.unschedule(scheduleName);
    this.logger.debug(`Job unscheduled from queue ${scheduleName}`);
  }

  async removeOldSchedules(activeCron: string[]): Promise<void> {
    const schedules = await this.getAllScheduleIds();
    for (const schedule of schedules) {
      if (!activeCron.includes(schedule)) {
        await this.removeSchedule(schedule);
      }
    }
  }

  async getAllScheduleIds(): Promise<string[]> {
    return (await this.boss.getSchedules()).map((schedule) => schedule.name);
  }

  async setupWorker(queue: string, handler: (data?: unknown) => Promise<void>): Promise<void> {
    await this.boss.work(queue, ([job]) => handler(job.data));
    this.logger.debug(`Worker setup for queue ${queue}`);
  }
}

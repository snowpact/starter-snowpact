import PgBoss from 'pg-boss';

export class TestQueueService {
  private constructor(public boss: PgBoss) {}

  public static setup = async (dbUrl: string): Promise<TestQueueService> => {
    const boss = new PgBoss(dbUrl);
    await boss.start();
    return new TestQueueService(boss);
  };

  public close = async (): Promise<void> => {
    await this.boss.stop();
  };

  public clear = async (): Promise<void> => {
    await this.boss.clearStorage();

    const schedules = await this.boss.getSchedules();
    for (const schedule of schedules) {
      await this.boss.unschedule(schedule.name);
    }

    const queues = await this.boss.getQueues();
    for (const queue of queues) {
      await this.boss.deleteQueue(queue.name);
    }
  };
}

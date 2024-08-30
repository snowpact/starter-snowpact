export interface ScheduleCronOptions {
  queue: string;
  cronTime: string;
  data: object;
}

export interface ClientQueueInterface {
  start(dbUrl: string): Promise<void>;
  stop(): Promise<void>;
  createQueue(queue: string): Promise<void>;
  setupAllQueues(): Promise<void>;
  removeQueue(queue: string): Promise<void>;
  sendJob(queue: string, data: object): Promise<string | null>;
  scheduleCron(options: ScheduleCronOptions): Promise<void>;
  removeSchedule(scheduleName: string): Promise<void>;
  removeOldSchedules(activeCron: string[]): Promise<void>;
  getAllScheduleIds(): Promise<string[]>;
  setupWorker(queue: string, handler: (data?: unknown) => Promise<void>): Promise<void>;
}

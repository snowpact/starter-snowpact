import { QueueName } from '@/domain/enums/queues.enum';

interface CronInterface {
  queue: QueueName;
  cronTime: string;
  data: object;
}

export const crons: CronInterface[] = [];

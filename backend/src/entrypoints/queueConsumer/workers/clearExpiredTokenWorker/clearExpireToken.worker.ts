import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

import { WorkerInterface } from '..';

export const getClearExpiredTokenWorker = (): WorkerInterface => {
  const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);
  const userTokenRepository = mainContainer.get<UserTokenRepositoryInterface>(
    TYPES.UserTokenRepository,
  );
  return {
    queue: QueueName.CLEAR_EXPIRED_TOKENS,
    handler: () => {
      logger.debug('[Worker] start Clearing expired tokens');
      return userTokenRepository.clearExpiredTokens();
    },
  };
};

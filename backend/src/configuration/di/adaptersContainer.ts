import { ContainerModule, interfaces } from 'inversify';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';
import { QueueSenderInterface } from '@/infrastructure/queue/queueSender/queueSender.interface';

import { EnvConfig } from '@/adapters/envConfig/envConfig';
import { Logger } from '@/adapters/logger/logger';
import { MailSender } from '@/adapters/mailSender/mailSender';
import { UserRepository } from '@/adapters/repositories/userRepository/user.repository';
import { UserTokenRepository } from '@/adapters/repositories/userTokenRepository/userToken.repository';
import { QueueSender } from '@/infrastructure/queue/queueSender/queueSender';

import { TYPES } from './types';

const adaptersContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
  bind<UserTokenRepositoryInterface>(TYPES.UserTokenRepository).to(UserTokenRepository);

  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<LoggerInterface>(TYPES.Logger).to(Logger).inSingletonScope();
  bind<EnvConfigInterface>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope();
  bind<QueueSenderInterface>(TYPES.QueueSender).to(QueueSender);
});

export { adaptersContainer };

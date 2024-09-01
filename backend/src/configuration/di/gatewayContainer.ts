import { ContainerModule, interfaces } from 'inversify';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';
import { QueueSenderInterface } from '@/infrastructure/queue/queueSender/queueSender.interface';

import { EnvConfig } from '@/gateways/envConfig/envConfig';
import { Logger } from '@/gateways/logger/logger';
import { MailSender } from '@/gateways/mailSender/mailSender';
import { UserRepository } from '@/gateways/repositories/userRepository/user.repository';
import { UserTokenRepository } from '@/gateways/repositories/userTokenRepository/userToken.repository';
import { QueueSender } from '@/infrastructure/queue/queueSender/queueSender';

import { TYPES } from './types';

const gatewayContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
  bind<UserTokenRepositoryInterface>(TYPES.UserTokenRepository).to(UserTokenRepository);

  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<LoggerInterface>(TYPES.Logger).to(Logger).inSingletonScope();
  bind<EnvConfigInterface>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope();
  bind<QueueSenderInterface>(TYPES.QueueSender).to(QueueSender);
});

export { gatewayContainer };

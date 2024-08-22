import { ContainerModule, interfaces } from 'inversify';

import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { StatelessTokenServiceInterface } from '@/application/services/statelessToken/statelessToken.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';

import { AuthService } from '@/application/services/authToken/authToken.service';
import { PasswordService } from '@/application/services/password/password.service';
import { StatelessTokenService } from '@/application/services/statelessToken/statelessToken.service';
import { UserTokenService } from '@/application/services/userToken/userToken.service';
import { EnvConfig } from '@/gateways/envConfig/envConfig';
import { Logger } from '@/gateways/logger/logger';
import { MailSender } from '@/gateways/mailSender/mailSender';

import { TYPES } from './types';

const serviceContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService);
  bind<StatelessTokenServiceInterface>(TYPES.StatelessTokenService).to(StatelessTokenService);
  bind<PasswordServiceInterface>(TYPES.PasswordService).to(PasswordService);
  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<LoggerInterface>(TYPES.Logger).to(Logger).inSingletonScope();
  bind<UserTokenServiceInterface>(TYPES.UserTokenService).to(UserTokenService);
  bind<EnvConfigInterface>(TYPES.EnvConfig).to(EnvConfig).inSingletonScope();
});

export { serviceContainer };

import { ContainerModule, interfaces } from 'inversify';

import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserTokenServiceInterface } from '@/application/services/userToken/userToken.service.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { AuthServiceInterface } from '@/gateways/authToken/authToken.service.interface';
import { StatelessTokenServiceInterface } from '@/gateways/helpers/statelessToken/statelessToken.service.interface';

import { PasswordService } from '@/application/services/password/password.service';
import { UserTokenService } from '@/application/services/userToken/userToken.service';
import { AuthService } from '@/gateways/authToken/authToken.service';
import { StatelessTokenService } from '@/gateways/helpers/statelessToken/statelessToken.service';
import { Logger } from '@/gateways/logger/logger';
import { MailSender } from '@/gateways/mailSender/mailSender';

import { TYPES } from './types';

const serviceContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService);
  bind<StatelessTokenServiceInterface>(TYPES.StatelessTokenService).to(StatelessTokenService);
  bind<PasswordServiceInterface>(TYPES.PasswordService).to(PasswordService);
  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<LoggerInterface>(TYPES.Logger).to(Logger);
  bind<UserTokenServiceInterface>(TYPES.UserTokenService).to(UserTokenService);
});

export { serviceContainer };

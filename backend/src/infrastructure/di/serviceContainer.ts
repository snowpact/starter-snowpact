import { ContainerModule, interfaces } from 'inversify';

import { AccountTokenServiceInterface } from '@/core/services/accountToken/accountToken.service.interface';
import { AuthServiceInterface } from '@/core/services/authToken/authToken.service.interface';
import { PasswordServiceInterface } from '@/core/services/password/password.service.interface';
import { StateFullTokenServiceInterface } from '@/core/services/stateFullToken/stateFullToken.service.interface';
import { StatelessTokenServiceInterface } from '@/core/services/statelessToken/statelessToken.service.interface';
import { LoggerServiceInterface } from '@/gateways/logger/logger.service.interface';
import { MailSenderInterface } from '@/gateways/mailer/mailSender/mailSender.interface';

import { AccountTokenService } from '@/core/services/accountToken/accountToken.service';
import { AuthService } from '@/core/services/authToken/authToken.service';
import { PasswordService } from '@/core/services/password/password.service';
import { StateFullTokenService } from '@/core/services/stateFullToken/stateFullToken.service';
import { StatelessTokenService } from '@/core/services/statelessToken/statelessToken.service';
import { LoggerService } from '@/gateways/logger/logger.service';
import { MailSender } from '@/gateways/mailer/mailSender/mailSender';

import { TYPES } from './types';

const serviceContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService);
  bind<StatelessTokenServiceInterface>(TYPES.StatelessTokenService).to(StatelessTokenService);
  bind<PasswordServiceInterface>(TYPES.PasswordService).to(PasswordService);
  bind<AccountTokenServiceInterface>(TYPES.AccountTokenService).to(AccountTokenService);
  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<LoggerServiceInterface>(TYPES.LoggerService).to(LoggerService);
  bind<StateFullTokenServiceInterface>(TYPES.StateFullTokenService).to(StateFullTokenService);
});

export { serviceContainer };

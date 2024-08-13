import { ContainerModule, interfaces } from 'inversify';

import { AccountTokenServiceInterface } from '@/application/services/accountToken/accountToken.service.interface';
import { AuthServiceInterface } from '@/application/services/authToken/authToken.service.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { StateFullTokenServiceInterface } from '@/application/services/stateFullToken/stateFullToken.service.interface';
import { StatelessTokenServiceInterface } from '@/application/services/statelessToken/statelessToken.service.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';

import { AccountTokenService } from '@/application/services/accountToken/accountToken.service';
import { AuthService } from '@/application/services/authToken/authToken.service';
import { PasswordService } from '@/application/services/password/password.service';
import { StateFullTokenService } from '@/application/services/stateFullToken/stateFullToken.service';
import { StatelessTokenService } from '@/application/services/statelessToken/statelessToken.service';
import { Logger } from '@/gateways/logger/logger';
import { MailSender } from '@/gateways/mailSender/mailSender';

import { TYPES } from './types';

const serviceContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService);
  bind<StatelessTokenServiceInterface>(TYPES.StatelessTokenService).to(StatelessTokenService);
  bind<PasswordServiceInterface>(TYPES.PasswordService).to(PasswordService);
  bind<AccountTokenServiceInterface>(TYPES.AccountTokenService).to(AccountTokenService);
  bind<MailSenderInterface>(TYPES.MailSender).to(MailSender);
  bind<LoggerInterface>(TYPES.Logger).to(Logger);
  bind<StateFullTokenServiceInterface>(TYPES.StateFullTokenService).to(StateFullTokenService);
});

export { serviceContainer };

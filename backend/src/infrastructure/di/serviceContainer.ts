import { ContainerModule, interfaces } from 'inversify';

import { AccountTokenServiceInterface } from '@/application/helpers/accountToken/accountToken.service.interface';
import { AuthServiceInterface } from '@/application/helpers/authToken/authToken.service.interface';
import { PasswordServiceInterface } from '@/application/helpers/password/password.service.interface';
import { LoggerServiceInterface } from '@/infrastructure/services/logger/logger.service.interface';

import { AuthService } from '@/application/helpers/authToken/authToken.service';
import { PasswordService } from '@/application/helpers/password/password.service';
import { LoggerService } from '@/infrastructure/services/logger/logger.service';

import { TYPES } from './types';
import { AccountTokenService } from '../../application/helpers/accountToken/accountToken.service';
import { SendResetPasswordEmailService } from '../services/mail/sendResetPasswordEmail/sendResetPasswordEmail.service';
import { SendResetPasswordEmailServiceInterface } from '../services/mail/sendResetPasswordEmail/sendResetPasswordEmail.service.interface';
import { StatelessTokenService } from '../services/statelessToken/statelessToken.service';
import { StatelessTokenServiceInterface } from '../services/statelessToken/statelessToken.service.interface';

const serviceContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<AuthServiceInterface>(TYPES.AuthService).to(AuthService);
  bind<StatelessTokenServiceInterface>(TYPES.StatelessTokenService).to(StatelessTokenService);
  bind<PasswordServiceInterface>(TYPES.PasswordService).to(PasswordService);
  bind<AccountTokenServiceInterface>(TYPES.AccountTokenService).to(AccountTokenService);
  bind<SendResetPasswordEmailServiceInterface>(TYPES.SendResetPasswordEmailService).to(
    SendResetPasswordEmailService,
  );
  bind<LoggerServiceInterface>(TYPES.LoggerService).to(LoggerService);
});

export { serviceContainer };

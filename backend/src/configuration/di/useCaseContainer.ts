import { ContainerModule, interfaces } from 'inversify';

import { GetUserUseCaseInterface } from '@/application/useCases/getUser/getUser.useCase.interface';
import { LoginUseCaseInterface } from '@/application/useCases/login/login.useCase.interface';
import { RefreshUseCaseInterface } from '@/application/useCases/refresh/refresh.useCase.interface';
import { RegisterUseCaseInterface } from '@/application/useCases/register/register.useCase.interface';
import { ResetPasswordUseCaseInterface } from '@/application/useCases/resetPassword/resetPassword.useCase.interface';
import { ValidateAccountUseCaseInterface } from '@/application/useCases/validateAccount/validateAccount.useCase.interface';

import { GetUserUseCase } from '@/application/useCases/getUser/getUser.useCase';
import { LoginUseCase } from '@/application/useCases/login/login.useCase';
import { RefreshUseCase } from '@/application/useCases/refresh/refresh.useCase';
import { RegisterUseCase } from '@/application/useCases/register/register.useCase';
import { ResetPasswordUseCase } from '@/application/useCases/resetPassword/resetPassword.useCase';
import { ValidateAccountUseCase } from '@/application/useCases/validateAccount/validateAccount.useCase';

import { TYPES } from './types';

const useCaseContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
  bind<LoginUseCaseInterface>(TYPES.LoginUseCase).to(LoginUseCase);
  bind<RefreshUseCaseInterface>(TYPES.RefreshUseCase).to(RefreshUseCase);
  bind<GetUserUseCaseInterface>(TYPES.GetUserUseCase).to(GetUserUseCase);
  bind<RegisterUseCaseInterface>(TYPES.RegisterUseCase).to(RegisterUseCase);
  bind<ValidateAccountUseCaseInterface>(TYPES.ValidateAccountUseCase).to(ValidateAccountUseCase);
});

export { useCaseContainer };

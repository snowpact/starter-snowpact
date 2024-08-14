import { ContainerModule, interfaces } from 'inversify';

import { GetUserUseCaseInterface } from '@/application/useCases/getUser/getUser.useCase.interface';
import { LoginUseCaseInterface } from '@/application/useCases/login/login.useCase.interface';
import { ResetPasswordUseCaseInterface } from '@/application/useCases/resetPassword/resetPassword.useCase.interface';

import { GetUserUseCase } from '@/application/useCases/getUser/getUser.useCase';
import { LoginUseCase } from '@/application/useCases/login/login.useCase';
import { ResetPasswordUseCase } from '@/application/useCases/resetPassword/resetPassword.useCase';

import { TYPES } from './types';

const useCaseContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
  bind<LoginUseCaseInterface>(TYPES.LoginUseCase).to(LoginUseCase);
  bind<GetUserUseCaseInterface>(TYPES.GetUserUseCase).to(GetUserUseCase);
});

export { useCaseContainer };
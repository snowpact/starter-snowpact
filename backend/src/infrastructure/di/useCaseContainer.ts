import { ContainerModule, interfaces } from 'inversify';

import { GetUserUseCaseInterface } from '@/core/useCases/getUser/getUser.useCase.interface';
import { LoginUseCaseInterface } from '@/core/useCases/login/login.useCase.interface';
import { ResetPasswordUseCaseInterface } from '@/core/useCases/resetPassword/resetPassword.useCase.interface';

import { GetUserUseCase } from '@/core/useCases/getUser/getUser.useCase';
import { LoginUseCase } from '@/core/useCases/login/login.useCase';
import { ResetPasswordUseCase } from '@/core/useCases/resetPassword/resetPassword.useCase';

import { TYPES } from './types';

const useCaseContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
  bind<LoginUseCaseInterface>(TYPES.LoginUseCase).to(LoginUseCase);
  bind<GetUserUseCaseInterface>(TYPES.GetUserUseCase).to(GetUserUseCase);
});

export { useCaseContainer };

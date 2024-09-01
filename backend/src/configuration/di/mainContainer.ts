import 'reflect-metadata';

import { Container } from 'inversify';

import { ResendValidationEmailUseCaseInterface } from '@/application/useCases/resendValidationEmail/resendValidationEmail.useCase.interface';

import { ResendValidationEmailUseCase } from '@/application/useCases/resendValidationEmail/resendValidationEmail.useCase';

import { entityContainer } from './entityContainer';
import { gatewayContainer } from './gatewayContainer';
import { infraContainer } from './infraContainer';
import { serviceContainer } from './serviceContainer';
import { TYPES } from './types';
import { useCaseContainer } from './useCaseContainer';

const mainContainer = new Container();

mainContainer.load(serviceContainer);
mainContainer.load(useCaseContainer);
mainContainer.load(entityContainer);
mainContainer.load(infraContainer);
mainContainer.load(gatewayContainer);

// Add this binding in the container configuration
mainContainer
  .bind<ResendValidationEmailUseCaseInterface>(TYPES.ResendValidationEmailUseCase)
  .to(ResendValidationEmailUseCase);

export { mainContainer };

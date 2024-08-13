import 'reflect-metadata';

import { Container } from 'inversify';

import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';
import { TokenRepositoryInterface } from '@/domain/interfaces/repositories/token.repository.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { ClientDatabase } from '@/gateways/helpers/database/clientDatabase/clientDatabase';
import { TokenRepository } from '@/gateways/repositories/tokenRepository/token.repository';
import { UserRepository } from '@/gateways/repositories/userRepository/user.repository';

import { entityContainer } from './entityContainer';
import { serviceContainer } from './serviceContainer';
import { TYPES } from './types';
import { useCaseContainer } from './useCaseContainer';

const mainContainer = new Container();

mainContainer.load(serviceContainer);
mainContainer.load(useCaseContainer);
mainContainer.load(entityContainer);

mainContainer
  .bind<ClientDatabaseInterface>(TYPES.ClientDatabase)
  .to(ClientDatabase)
  .inSingletonScope();

mainContainer.bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
mainContainer.bind<TokenRepositoryInterface>(TYPES.TokenRepository).to(TokenRepository);

export { mainContainer };

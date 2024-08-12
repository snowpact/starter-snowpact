import 'reflect-metadata';

import { Container } from 'inversify';

import { ClientDatabaseInterface } from '@/gateways/database/clientDatabase/clientDatabase.interface';
import { TokenRepositoryInterface } from '@/gateways/database/repositories/tokenRepository/token.repository.interface';
import { UserRepositoryInterface } from '@/gateways/database/repositories/userRepository/user.repository.interface';

import { ClientDatabase } from '@/gateways/database/clientDatabase/clientDatabase';
import { TokenRepository } from '@/gateways/database/repositories/tokenRepository/token.repository';
import { UserRepository } from '@/gateways/database/repositories/userRepository/user.repository';

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

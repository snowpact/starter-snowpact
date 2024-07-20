import 'reflect-metadata';

import { Container } from 'inversify';

import { entityContainer } from './entityContainer';
import { serviceContainer } from './serviceContainer';
import { TYPES } from './types';
import { useCaseContainer } from './useCaseContainer';
import { ClientDatabase } from '../database/clientDatabase/clientDatabase';
import { ClientDatabaseInterface } from '../database/clientDatabase/clientDatabase.interface';
import { UserRepository } from '../repositories/userRepository/user.repository';
import { UserRepositoryInterface } from '../repositories/userRepository/user.repository.interface';

const mainContainer = new Container();

mainContainer.load(serviceContainer);
mainContainer.load(useCaseContainer);
mainContainer.load(entityContainer);

mainContainer
  .bind<ClientDatabaseInterface>(TYPES.ClientDatabase)
  .to(ClientDatabase)
  .inSingletonScope();

mainContainer.bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);

export { mainContainer };

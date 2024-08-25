import 'reflect-metadata';

import { Container } from 'inversify';

import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';
import { UserTokenRepositoryInterface } from '@/domain/interfaces/repositories/userToken.repository.interface';
import { MailerInterface } from '@/infrastructure/clientMailer/mailer.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { UserRepository } from '@/gateways/repositories/userRepository/user.repository';
import { UserTokenRepository } from '@/gateways/repositories/userTokenRepository/userToken.repository';
import { Mailer } from '@/infrastructure/clientMailer/mailer';
import { ClientDatabase } from '@/infrastructure/database/clientDatabase/clientDatabase';

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

mainContainer.bind<MailerInterface>(TYPES.Mailer).to(Mailer);

mainContainer.bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
mainContainer.bind<UserTokenRepositoryInterface>(TYPES.UserTokenRepository).to(UserTokenRepository);

export { mainContainer };

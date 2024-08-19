import { ContainerModule, interfaces } from 'inversify';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';

import { User } from '@/domain/entities/user/user.entity';

import { TYPES } from './types';

const entityContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<UserInterface>(TYPES.UserEntity).to(User);
});

export { entityContainer };

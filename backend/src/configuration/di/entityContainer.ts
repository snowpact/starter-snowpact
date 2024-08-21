import { ContainerModule, interfaces } from 'inversify';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';

import { User } from '@/domain/entities/user/user.entity';
import { UserToken } from '@/domain/entities/userToken/userToken.entity';

import { TYPES } from './types';

const entityContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<UserInterface>(TYPES.UserEntity).to(User);
  bind<UserTokenInterface>(TYPES.UserTokenEntity).to(UserToken);
});

export { entityContainer };

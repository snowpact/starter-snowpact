import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface ExecuteGetUserOptions {
  currentUser?: UserInterface;
  userId: string;
  shouldBeSameUser?: boolean;
}

export interface GetUserUseCaseInterface {
  executeGetUser: (options: ExecuteGetUserOptions) => Promise<UserInterface>;
}

import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface ExecuteGetUserOptions {
  currentUserId: string;
  userId: string;
}

export interface GetUserUseCaseInterface {
  executeGetUser: (options: ExecuteGetUserOptions) => Promise<UserInterface>;
}

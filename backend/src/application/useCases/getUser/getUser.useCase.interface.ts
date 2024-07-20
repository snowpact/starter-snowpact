import { User } from '@/application/entities/user/user.entity';

export interface ExecuteGetUserOptions {
  currentUserId: string;
  userId: string;
}

export interface GetUserUseCaseInterface {
  executeGetUser: (options: ExecuteGetUserOptions) => Promise<User>;
}

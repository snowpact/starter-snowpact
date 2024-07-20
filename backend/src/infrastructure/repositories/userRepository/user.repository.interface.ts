import { UserInterface } from '@/application/entities/user/user.entity.interface';

export interface UserRepositoryInterface {
  findByEmail: (email: string) => Promise<UserInterface | undefined>;
  findById: (id: string) => Promise<UserInterface | undefined>;
  updateOne: (id: string, data: Partial<UserInterface>) => Promise<void>;
}

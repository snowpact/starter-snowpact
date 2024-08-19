import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export interface UserRepositoryInterface {
  findByEmail: (email: string) => Promise<UserInterface | null>;
  findById: (id: string) => Promise<UserInterface | null>;
  updateOne: (id: string, data: Partial<UserInterface>) => Promise<void>;
}

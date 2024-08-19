import { UserInterface } from './user.entity.interface';

export class User implements UserInterface {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public admin: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}

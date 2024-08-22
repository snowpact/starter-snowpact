import { DataSource } from 'typeorm';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';

import { UserSchema, UserTokenSchema } from '@/gateways/helpers/database/schema';

export class TestDbService {
  constructor(private dataSource: DataSource) {}

  public close = async (): Promise<void> => {
    await this.dataSource.destroy();
  };

  public clear = async (): Promise<void> => {
    const entities = this.dataSource.entityMetadatas;
    const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

    await this.dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
  };

  public persistUser = async (user: UserInterface): Promise<void> => {
    await this.dataSource.getRepository(UserSchema).save(user);
  };

  public getUser = async (id: string): Promise<UserInterface | null> => {
    return this.dataSource.getRepository(UserSchema).findOne({ where: { id } });
  };

  public getUserByEmail = async (email: string): Promise<UserInterface | null> => {
    return this.dataSource.getRepository(UserSchema).findOne({ where: { email } });
  };

  public persistToken = async (token: UserTokenInterface): Promise<void> => {
    await this.dataSource.getRepository(UserTokenSchema).save(token);
  };

  public getToken = async (tokenValue: string): Promise<UserTokenInterface | null> => {
    return this.dataSource.getRepository(UserTokenSchema).findOne({ where: { value: tokenValue } });
  };

  public getTokensByUserId = async (userId: string): Promise<UserTokenInterface[]> => {
    return this.dataSource.getRepository(UserTokenSchema).find({ where: { userId } });
  };
}

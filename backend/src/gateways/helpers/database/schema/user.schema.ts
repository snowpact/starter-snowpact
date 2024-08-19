import { EntitySchema } from 'typeorm';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export const UserSchema = new EntitySchema<UserInterface>({
  name: 'user',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    email: {
      type: 'varchar',
      length: '255',
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: '255',
      nullable: false,
    },
    admin: {
      type: 'boolean',
      nullable: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp with time zone',
      updateDate: true,
    },
  },
  relations: {
    userTokens: {
      type: 'one-to-many',
      target: 'user_token',
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
      },
    },
  },
});

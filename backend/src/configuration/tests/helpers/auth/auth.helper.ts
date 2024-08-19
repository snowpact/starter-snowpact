import { StatelessTokenInterface } from '@/domain/interfaces/statelessToken.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { envConfig } from '@/configuration/env/envConfig.singleton';

export interface GenerateAccessTokenOptions {
  userId: string;
  expiresIn?: number;
  secret?: string;
}

export const generateAccessToken = async ({
  userId,
  expiresIn = 3600,
  secret = envConfig.accessTokenSecret,
}: GenerateAccessTokenOptions) => {
  const statelessToken = mainContainer.get<StatelessTokenInterface>(TYPES.StatelessToken);
  return statelessToken.generateToken({ payload: { userId }, expiresIn, secret });
};

import { StatelessTokenServiceInterface } from '@/application/services/statelessToken/statelessToken.service.interface';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

export interface GenerateAccessTokenOptions {
  userId: string;
  expiresIn?: number;
  secret?: string;
}

export const generateAccessToken = async ({
  userId,
  expiresIn = 3600,
  secret,
}: GenerateAccessTokenOptions) => {
  const statelessToken = mainContainer.get<StatelessTokenServiceInterface>(
    TYPES.StatelessTokenService,
  );
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
  return statelessToken.generateToken({
    payload: { userId },
    expiresIn,
    secret: secret ?? envConfig.accessTokenSecret,
  });
};

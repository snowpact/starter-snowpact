import { StatelessTokenService } from '@/application/services/statelessToken/statelessToken.service';
import { envConfig, envConfig } from '@/configuration/config/env';
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
  secret = envConfig.ACCESS_TOKEN_SECRET,
}: GenerateAccessTokenOptions) => {
  const statelessTokenService = mainContainer.get<StatelessTokenService>(
    TYPES.StatelessTokenService,
  );
  return statelessTokenService.generateToken({ payload: { userId }, expiresIn, secret });
};

import { StatelessTokenService } from '@/core/services/statelessToken/statelessToken.service';
import { envConfig } from '@/infrastructure/config/env';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';

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

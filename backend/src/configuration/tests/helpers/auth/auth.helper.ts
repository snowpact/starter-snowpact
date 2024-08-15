import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { envConfig } from '@/configuration/env/envConfig.singleton';
import { StatelessTokenService } from '@/gateways/helpers/statelessToken/statelessToken.service';

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
  const statelessTokenService = mainContainer.get<StatelessTokenService>(
    TYPES.StatelessTokenService,
  );
  return statelessTokenService.generateToken({ payload: { userId }, expiresIn, secret });
};

import { inject, injectable } from 'inversify';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { TYPES } from '@/configuration/di/types';
import { envConfig } from '@/configuration/env/envConfig';

import { AuthServiceInterface, UserPayloadOptions } from './authToken.service.interface';
import { UserTokenServiceInterface } from '../../application/services/userToken/userToken.service.interface';
import { StatelessTokenServiceInterface } from '../helpers/statelessToken/statelessToken.service.interface';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(TYPES.StatelessTokenService)
    private statelessTokenService: StatelessTokenServiceInterface,
    @inject(TYPES.UserTokenService)
    private userTokenService: UserTokenServiceInterface,
  ) {}

  generateAccessToken(userId: string): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload: { userId },
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }
  generateRefreshToken(userId: string): Promise<string> {
    return this.userTokenService.generateToken({
      userId,
      canBeRefreshed: true,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      tokenType: UserTokenTypeEnum.refreshToken,
    });
  }
  verifyAccessToken(token: string, ignoreExpiration = false): Promise<UserPayloadOptions> {
    return this.statelessTokenService.verifyToken<UserPayloadOptions>({
      token,
      secret: envConfig.ACCESS_TOKEN_SECRET,
      ignoreExpiration,
    });
  }
  refreshToken(token: string): Promise<string> {
    return this.userTokenService.refreshToken({
      tokenValue: token,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
    });
  }
}

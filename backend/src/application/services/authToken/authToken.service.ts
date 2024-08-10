import { inject, injectable } from 'inversify';

import { StateFullTokenServiceInterface } from '@/infrastructure/services/stateFullToken/stateFullToken.service.interface';
import { TokenTypeEnum } from '@/infrastructure/services/stateFullToken/token/token.interface';
import { StatelessTokenServiceInterface } from '@/infrastructure/services/statelessToken/statelessToken.service.interface';

import { envConfig } from '@/infrastructure/config/env';
import { TYPES } from '@/infrastructure/di/types';

import { AuthServiceInterface, UserPayloadOptions } from './authToken.service.interface';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(TYPES.StatelessTokenService)
    private statelessTokenService: StatelessTokenServiceInterface,
    @inject(TYPES.StateFullTokenService)
    private stateFullTokenService: StateFullTokenServiceInterface,
  ) {}

  generateAccessToken(userId: string): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload: { userId },
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }
  generateRefreshToken(userId: string): Promise<string> {
    return this.stateFullTokenService.generateToken({
      userId,
      canBeRefreshed: true,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      tokenType: TokenTypeEnum.refreshToken,
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
    return this.stateFullTokenService.refreshToken({
      tokenValue: token,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
    });
  }
}

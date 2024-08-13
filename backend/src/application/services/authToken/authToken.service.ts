import { inject, injectable } from 'inversify';

import { TokenTypeEnum } from '@/domain/entities/token/token.entity.interface';

import { envConfig } from '@/configuration/config/env';
import { TYPES } from '@/configuration/di/types';

import { AuthServiceInterface, UserPayloadOptions } from './authToken.service.interface';
import { StateFullTokenServiceInterface } from '../stateFullToken/stateFullToken.service.interface';
import { StatelessTokenServiceInterface } from '../statelessToken/statelessToken.service.interface';

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

import { inject, injectable } from 'inversify';

import { StatelessTokenServiceInterface } from '@/infrastructure/services/statelessToken/statelessToken.service.interface';

import { envConfig } from '@/infrastructure/config/env';
import { TYPES } from '@/infrastructure/di/types';

import { AuthServiceInterface, UserPayloadOptions } from './authToken.service.interface';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(TYPES.StatelessTokenService)
    private statelessTokenService: StatelessTokenServiceInterface,
  ) {}

  generateAccessToken(payload: UserPayloadOptions): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }
  generateRefreshToken(payload: UserPayloadOptions): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
  verifyAccessToken(token: string, ignoreExpiration = false): Promise<UserPayloadOptions> {
    return this.statelessTokenService.verifyToken<UserPayloadOptions>({
      token,
      secret: envConfig.ACCESS_TOKEN_SECRET,
      ignoreExpiration,
    });
  }
  verifyRefreshToken(token: string, ignoreExpiration = false): Promise<UserPayloadOptions> {
    return this.statelessTokenService.verifyToken<UserPayloadOptions>({
      token,
      secret: envConfig.REFRESH_TOKEN_SECRET,
      ignoreExpiration,
    });
  }
}

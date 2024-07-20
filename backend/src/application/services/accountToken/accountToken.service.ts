import { inject, injectable } from 'inversify';

import { StatelessTokenServiceInterface } from '@/infrastructure/services/statelessToken/statelessToken.service.interface';

import { envConfig } from '@/infrastructure/config/env';
import { TYPES } from '@/infrastructure/di/types';

import { AccountTokenServiceInterface, UserPayloadOptions } from './accountToken.service.interface';

@injectable()
export class AccountTokenService implements AccountTokenServiceInterface {
  constructor(
    @inject(TYPES.StatelessTokenService)
    private statelessTokenService: StatelessTokenServiceInterface,
  ) {}

  generateAccountToken(userPayload: UserPayloadOptions): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload: userPayload,
      expiresIn: envConfig.ACCOUNT_TOKEN_EXPIRATION,
      secret: envConfig.ACCOUNT_TOKEN_SECRET,
    });
  }

  verifyAccountToken(token: string, ignoreExpiration = false): Promise<UserPayloadOptions> {
    return this.statelessTokenService.verifyToken<UserPayloadOptions>({
      token,
      secret: envConfig.ACCOUNT_TOKEN_SECRET,
      ignoreExpiration,
    });
  }
}

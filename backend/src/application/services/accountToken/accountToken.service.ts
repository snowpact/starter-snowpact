import { inject, injectable } from 'inversify';

import { StateFullTokenServiceInterface } from '@/infrastructure/services/stateFullToken/stateFullToken.service.interface';

import { envConfig } from '@/infrastructure/config/env';
import { TYPES } from '@/infrastructure/di/types';

import {
  AccountTokenServiceInterface,
  GenerateAccountTokenOptions,
  VerifyTokenOptions,
} from './accountToken.service.interface';

@injectable()
export class AccountTokenService implements AccountTokenServiceInterface {
  constructor(
    @inject(TYPES.StateFullTokenService)
    private stateFullTokenService: StateFullTokenServiceInterface,
  ) {}

  generateAccountToken(userPayload: GenerateAccountTokenOptions): Promise<string> {
    return this.stateFullTokenService.generateToken({
      userId: userPayload.userId,
      expiresIn: envConfig.ACCOUNT_TOKEN_EXPIRATION,
      canBeRefreshed: false,
      tokenType: userPayload.tokenType,
    });
  }

  async verifyAccountToken({ tokenValue, tokenType }: VerifyTokenOptions): Promise<string> {
    const token = await this.stateFullTokenService.verifyToken({
      tokenValue,
      tokenType,
      ignoreExpiration: false,
    });
    return token.userId;
  }

  deleteAccountToken(token: string): Promise<void> {
    return this.stateFullTokenService.removeToken(token);
  }
}

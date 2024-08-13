import { inject, injectable } from 'inversify';

import { envConfig } from '@/configuration/config/env';
import { TYPES } from '@/configuration/di/types';

import {
  AccountTokenServiceInterface,
  GenerateAccountTokenOptions,
  VerifyTokenOptions,
} from './accountToken.service.interface';
import { StateFullTokenServiceInterface } from '../stateFullToken/stateFullToken.service.interface';

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

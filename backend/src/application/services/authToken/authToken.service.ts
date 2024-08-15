import { inject, injectable } from 'inversify';
import { z } from 'zod';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { AuthServiceInterface, UserPayloadOptions } from './authToken.service.interface';
import { StatelessTokenServiceInterface } from '../../../gateways/helpers/statelessToken/statelessToken.service.interface';
import { UserTokenServiceInterface } from '../userToken/userToken.service.interface';

const UserPayloadOptionsSchema = z.object({
  userId: z.string(),
});

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(TYPES.StatelessTokenService)
    private statelessTokenService: StatelessTokenServiceInterface,
    @inject(TYPES.UserTokenService)
    private userTokenService: UserTokenServiceInterface,
    @inject(TYPES.EnvConfig)
    private envConfig: EnvConfigInterface,
  ) {}

  generateAccessToken(userId: string): Promise<string> {
    return this.statelessTokenService.generateToken({
      payload: { userId },
      expiresIn: this.envConfig.accessTokenExpiration,
      secret: this.envConfig.accessTokenSecret,
    });
  }
  generateRefreshToken(userId: string): Promise<string> {
    return this.userTokenService.generateToken({
      userId,
      canBeRefreshed: true,
      expiresIn: this.envConfig.refreshTokenExpiration,
      tokenType: UserTokenTypeEnum.refreshToken,
    });
  }
  async verifyAccessToken(token: string, ignoreExpiration = false): Promise<UserPayloadOptions> {
    const payload = await this.statelessTokenService.verifyToken({
      token,
      secret: this.envConfig.accessTokenSecret,
      ignoreExpiration,
    });

    const parseResult = UserPayloadOptionsSchema.safeParse(payload);

    if (!parseResult.success) {
      throw new AppError({
        message: 'Invalid jwt token',
        code: AppErrorCodes.INVALID_JWT_TOKEN,
        privateContext: {
          message: 'Payload have invalid format',
          payload,
          token,
        },
      });
    }

    return parseResult.data;
  }
  refreshToken(token: string): Promise<string> {
    return this.userTokenService.refreshToken({
      tokenValue: token,
      expiresIn: this.envConfig.refreshTokenExpiration,
    });
  }
}

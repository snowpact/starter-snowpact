import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import {
  GenerateStatelessTokenOptions,
  StatelessTokenServiceInterface,
  VerifyStatelessTokenOptions,
} from './statelessToken.service.interface';

@injectable()
export class StatelessTokenService implements StatelessTokenServiceInterface {
  constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {}
  async generateToken({
    payload,
    secret,
    expiresIn,
  }: GenerateStatelessTokenOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      });
    });
  }

  async verifyToken({
    token,
    secret,
    ignoreExpiration = false,
  }: VerifyStatelessTokenOptions): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      jwt.verify(token, secret, { ignoreExpiration }, (err, decoded) => {
        if (err) {
          this.logger.error('Invalid jwt token', err, { token });
          reject(
            new AppError({
              message: 'Invalid jwt token',
              code: AppErrorCodes.INVALID_JWT_TOKEN,
            }),
          );
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

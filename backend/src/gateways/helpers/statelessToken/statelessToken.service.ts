import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { AppError } from '@/application/errors/app.error';

import {
  GenerateStatelessTokenOptions,
  StatelessTokenServiceInterface,
  VerifyStatelessTokenOptions,
} from './statelessToken.service.interface';

@injectable()
export class StatelessTokenService implements StatelessTokenServiceInterface {
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
          reject(
            new AppError({
              message: 'Invalid jwt token',
              code: AppErrorCodes.INVALID_JWT_TOKEN,
              privateContext: {
                error: err,
                token,
              },
            }),
          );
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

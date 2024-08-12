import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import {
  GenerateStatelessTokenOptions,
  StatelessTokenServiceInterface,
  VerifyStatelessTokenOptions,
} from './statelessToken.service.interface';

@injectable()
export class StatelessTokenService implements StatelessTokenServiceInterface {
  async generateToken<PayloadType extends string | object | Buffer>({
    payload,
    secret,
    expiresIn,
  }: GenerateStatelessTokenOptions<PayloadType>): Promise<string> {
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

  async verifyToken<PayloadType>({
    token,
    secret,
    ignoreExpiration = false,
  }: VerifyStatelessTokenOptions): Promise<PayloadType> {
    return new Promise<PayloadType>((resolve, reject) => {
      jwt.verify(token, secret, { ignoreExpiration }, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as PayloadType);
        }
      });
    });
  }
}

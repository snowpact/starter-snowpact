import { hash, compare } from 'bcrypt';
import { injectable } from 'inversify';

import { PasswordServiceInterface } from './password.service.interface';

@injectable()
export class PasswordService implements PasswordServiceInterface {
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;

  checkPasswordComplexity(password: string): boolean {
    return this.passwordRegex.test(password);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}

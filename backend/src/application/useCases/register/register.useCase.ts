import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { PasswordServiceInterface } from '@/application/services/password/password.service.interface';
import { UserInterface } from '@/domain/entities/user/user.entity.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';
import { UserRepositoryInterface } from '@/domain/interfaces/repositories/user.repository.interface';

import { AppError } from '@/application/errors/app.error';
import { TYPES } from '@/configuration/di/types';

import { RegisterUseCaseInterface } from './register.useCase.interface';

@injectable()
export class RegisterUseCase implements RegisterUseCaseInterface {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepositoryInterface,
    @inject(TYPES.PasswordService) private passwordService: PasswordServiceInterface,
    @inject(TYPES.MailSender) private mailSender: MailSenderInterface,
    @inject(TYPES.Logger) private logger: LoggerInterface,
  ) {}
  async executeRegister(email: string, password: string): Promise<void> {
    const lowerCaseEmail = email.toLowerCase();
    const alreadyExistUser = await this.userRepository.findByEmail(lowerCaseEmail);
    if (alreadyExistUser) {
      throw new AppError({
        code: AppErrorCodes.EMAIL_ALREADY_TAKEN,
        message: 'Email already taken',
        privateContext: { email },
      });
    }

    const isPasswordValid = this.passwordService.checkPasswordComplexity(password);
    if (!isPasswordValid) {
      throw new AppError({
        code: AppErrorCodes.INVALID_PASSWORD_COMPLEXITY,
        message: 'Invalid password complexity',
      });
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const user: UserInterface = {
      id: v4(),
      email: lowerCaseEmail,
      password: hashedPassword,
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userTokens: [],
    };
    await this.userRepository.create(user);

    await this.mailSender.sendRegisterEmail(lowerCaseEmail);
    this.logger.debug('User created', { email: lowerCaseEmail });
  }
}

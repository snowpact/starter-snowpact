const TYPES = {
  UserEntity: Symbol.for('UserEntity'),

  LoginUseCase: Symbol.for('LoginUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),

  AuthService: Symbol.for('AuthService'),
  StatelessTokenService: Symbol.for('StatelessTokenService'),
  PasswordService: Symbol.for('PasswordService'),
  ClientDatabase: Symbol.for('ClientDatabase'),
  UserRepository: Symbol.for('UserRepository'),
  LoggerService: Symbol.for('LoggerService'),
  MailerService: Symbol.for('MailerService'),

  MainHonoApp: Symbol.for('MainHonoApp'),
  SendResetPasswordEmailService: Symbol.for('SendResetPasswordEmailService'),
  AccountTokenService: Symbol.for('AccountTokenService'),
};

export { TYPES };

const TYPES = {
  UserEntity: Symbol.for('UserEntity'),

  LoginUseCase: Symbol.for('LoginUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),

  AuthService: Symbol.for('AuthService'),
  StatelessTokenService: Symbol.for('StatelessTokenService'),
  PasswordService: Symbol.for('PasswordService'),
  ClientDatabase: Symbol.for('ClientDatabase'),
  LoggerService: Symbol.for('LoggerService'),
  MailerService: Symbol.for('MailerService'),
  StateFullTokenService: Symbol.for('StateFullTokenService'),

  UserRepository: Symbol.for('UserRepository'),
  TokenRepository: Symbol.for('TokenRepository'),

  MainHonoApp: Symbol.for('MainHonoApp'),
  SendResetPasswordEmailService: Symbol.for('SendResetPasswordEmailService'),
  MailSender: Symbol.for('MailSender'),
  AccountTokenService: Symbol.for('AccountTokenService'),
};

export { TYPES };

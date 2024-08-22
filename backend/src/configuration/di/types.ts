const TYPES = {
  UserEntity: Symbol.for('UserEntity'),
  UserTokenEntity: Symbol.for('UserTokenEntity'),

  LoginUseCase: Symbol.for('LoginUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  RefreshUseCase: Symbol.for('RefreshUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),

  AuthService: Symbol.for('AuthService'),
  StatelessTokenService: Symbol.for('StatelessTokenService'),
  PasswordService: Symbol.for('PasswordService'),
  ClientDatabase: Symbol.for('ClientDatabase'),
  EnvConfig: Symbol.for('EnvConfig'),
  Logger: Symbol.for('Logger'),
  Mailer: Symbol.for('Mailer'),
  UserTokenService: Symbol.for('UserTokenService'),

  UserRepository: Symbol.for('UserRepository'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),

  MainHonoApp: Symbol.for('MainHonoApp'),
  SendResetPasswordEmailService: Symbol.for('SendResetPasswordEmailService'),
  MailSender: Symbol.for('MailSender'),
  AccountTokenService: Symbol.for('AccountTokenService'),
};

export { TYPES };

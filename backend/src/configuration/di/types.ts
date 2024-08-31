const TYPES = {
  // Entities
  UserEntity: Symbol.for('UserEntity'),
  UserTokenEntity: Symbol.for('UserTokenEntity'),

  // Use Cases
  LoginUseCase: Symbol.for('LoginUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  RefreshUseCase: Symbol.for('RefreshUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  ValidateAccountUseCase: Symbol.for('ValidateAccountUseCase'),

  // Services
  AuthService: Symbol.for('AuthService'),
  StatelessTokenService: Symbol.for('StatelessTokenService'),
  PasswordService: Symbol.for('PasswordService'),
  EnvConfig: Symbol.for('EnvConfig'),
  Logger: Symbol.for('Logger'),
  UserTokenService: Symbol.for('UserTokenService'),

  // Gateways
  SendResetPasswordEmailService: Symbol.for('SendResetPasswordEmailService'),
  MailSender: Symbol.for('MailSender'),
  AccountTokenService: Symbol.for('AccountTokenService'),
  QueueSender: Symbol.for('QueueSender'),

  UserRepository: Symbol.for('UserRepository'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),

  // Infra
  ClientDatabase: Symbol.for('ClientDatabase'),
  Mailer: Symbol.for('Mailer'),
  ClientQueue: Symbol.for('ClientQueue'),
};

export { TYPES };

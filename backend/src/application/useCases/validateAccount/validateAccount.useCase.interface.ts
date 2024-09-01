export interface ValidateAccountUseCaseInterface {
  executeValidateAccount(tokenValue: string): Promise<void>;
}

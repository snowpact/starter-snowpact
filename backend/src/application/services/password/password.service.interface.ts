export interface PasswordServiceInterface {
  checkPasswordComplexity: (password: string) => boolean;
  hashPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
}

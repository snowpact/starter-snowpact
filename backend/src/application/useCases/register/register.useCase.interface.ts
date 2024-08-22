export interface RegisterUseCaseInterface {
  executeRegister(email: string, password: string): Promise<void>;
}

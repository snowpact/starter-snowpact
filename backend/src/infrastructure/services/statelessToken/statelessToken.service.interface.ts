export interface GenerateStatelessTokenOptions<PayloadType> {
  payload: PayloadType;
  expiresIn: number;
  secret: string;
}

export interface VerifyStatelessTokenOptions {
  token: string;
  ignoreExpiration?: boolean;
  secret: string;
}

export interface StatelessTokenServiceInterface {
  generateToken<PayloadType extends string | object | Buffer>(
    options: GenerateStatelessTokenOptions<PayloadType>,
  ): Promise<string>;
  verifyToken<PayloadType>(options: VerifyStatelessTokenOptions): Promise<PayloadType>;
}

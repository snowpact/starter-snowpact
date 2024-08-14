export interface GenerateStatelessTokenOptions {
  payload: string | object | Buffer;
  expiresIn: number;
  secret: string;
}

export interface VerifyStatelessTokenOptions {
  token: string;
  ignoreExpiration?: boolean;
  secret: string;
}

export interface StatelessTokenServiceInterface {
  generateToken(options: GenerateStatelessTokenOptions): Promise<string>;
  verifyToken(options: VerifyStatelessTokenOptions): Promise<unknown>;
}

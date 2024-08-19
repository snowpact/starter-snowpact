export interface EnvConfigInterface {
  nodeEnv: string;
  port: number;
  logLevel: string;
  dbName: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbUrl: string;
  accessTokenSecret: string;
  accessTokenExpiration: number;
  refreshTokenSecret: string;
  refreshTokenExpiration: number;
  accountTokenSecret: string;
  accountTokenExpiration: number;
  smtpUrl: string;
  fromEmail: string;
  emailSend: boolean;
}

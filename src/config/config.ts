import * as dotenv from 'dotenv';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

export const CONFIG: Record<string, string> = {
  app: process.env.APP || 'dev',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8080',
  db_dialect: process.env.DB_DIALECT || 'mongo',
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || '27017',
  db_name: process.env.DB_NAME || 'roulette-rest',
  db_user: process.env.DB_USER || 'clicktronix',
  db_password: process.env.DB_PASSWORD || '23031994',
  jwt_encryption: process.env.JWT_ENCRYPTION || 'jwt_please_change',
  jwt_expiration: process.env.JWT_EXPIRATION || '10000',
};

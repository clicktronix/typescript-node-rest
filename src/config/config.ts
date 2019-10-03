import * as dotenv from 'dotenv';

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config();

export const CONFIG = {
  app: process.env.APP || 'dev',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8080',
  db_dialect: process.env.DB_DIALECT || 'mongo',
  db_host: process.env.DB_HOST || 'localhost',
  db_port: process.env.DB_PORT || '27017',
  db_name: process.env.DB_NAME || 'db-name',
  db_user: process.env.DB_USER || 'user',
  db_password: process.env.DB_PASSWORD || 'password',
  jwt_encryption: process.env.NODE_ENV === 'test' ? 'TEST_KEY' : process.env.JWT_ENCRYPTION || 'SECRET_KEY',
  jwt_expiration: process.env.JWT_EXPIRATION || '600000',
};

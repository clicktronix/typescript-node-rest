import * as mongoose from 'mongoose';
import { default as chalk } from 'chalk';
import { CONFIG } from './config';

/**
 * Connect to MongoDB.
 */
export const dataBaseConnect = async () => {
  const mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;

  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true });
  mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });
};

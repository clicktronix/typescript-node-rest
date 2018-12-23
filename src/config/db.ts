import * as mongoose from 'mongoose';
import { CONFIG } from './config';

// Connecting to the database
export const dataBaseConnect = async () => {
  const mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;

  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true });
    // listen for requests
    console.log('The connection is OK');
  } catch (err) {
    console.log(`${err} Couldn't Connect to the Database.`);
    process.exit();
  }
};

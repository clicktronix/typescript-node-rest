import { default as mongoose } from 'mongoose';
import { default as chalk } from 'chalk';

import { CONFIG } from 'config';

export class DataBase {
  private mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;
  private mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  public connect() {
    mongoose.connect(this.mongoUrl, this.mongoOptions);
    mongoose.connection.on('error', (err) => {
      console.error(err);
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
      process.exit();
    });
  }
}

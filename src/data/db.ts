import { default as mongoose } from 'mongoose';
import { default as chalk } from 'chalk';
import { default as MongoMemoryServer } from 'mongodb-memory-server';
import { CONFIG } from 'config';

export class DataBase {
  private mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;
  private mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  public connect() {
    if (process.env.NODE_ENV === 'test') {
      const mongod = new MongoMemoryServer();
      mongod.getConnectionString().then((mongoUri) => {
        mongoose.connect(mongoUri, {
          ...this.mongoOptions,
          autoReconnect: true,
        });
        mongoose.connection.on('error', (e) => {
          console.log(e);
          process.exit();
        });
        mongoose.connection.once('open', () => {
          console.log(`MongoDB successfully connected to ${mongoUri}`);
        });
      });
    } else {
      mongoose.connect(this.mongoUrl, this.mongoOptions);
      mongoose.connection.on('error', (err) => {
        console.error(err);
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
        process.exit();
      });
    }
  }
}

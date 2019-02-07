import { default as mongoose } from 'mongoose';
import { default as MongoMemoryServer } from 'mongodb-memory-server';
import { CONFIG } from 'config';

export class DataBase {
  private mongod: MongoMemoryServer | null = null;
  private mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;
  private mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  public connect() {
    if (process.env.NODE_ENV === 'test') {
      this.mongod = new MongoMemoryServer();
      this.mongod.getConnectionString().then((mongoUri) => {
        mongoose.connect(mongoUri, {
          ...this.mongoOptions,
          autoReconnect: true,
        });
        mongoose.connection.on('error', err => {
          console.log(err);
          process.exit();
        });
      });
    } else {
      mongoose.connect(this.mongoUrl, this.mongoOptions);
      mongoose.connection.on('error', err => {
        console.error(err);
        process.exit();
      });
    }
  }
}

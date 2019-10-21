import { default as mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { CONFIG } from 'config';
import { EventEmitter } from 'events';

export class DataBase {
  private emitter = new EventEmitter();
  private mongodTest: MongoMemoryServer | null = null;
  private mongoUrl = 'mongodb://' + CONFIG.db_user + ':' + CONFIG.db_password + '@'
    + CONFIG.db_host + ':' + CONFIG.db_port + '/' + CONFIG.db_name;
  private mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  public async connect() {
    if (process.env.NODE_ENV === 'test') {
      this.mongodTest = new MongoMemoryServer();
      const mongoUri = await this.mongodTest.getConnectionString();
      mongoose.connect(mongoUri, {
        ...this.mongoOptions,
      });
      mongoose.connection.on('error', err => {
        console.log(err);
        process.exit();
      });
      this.emitter.emit('dbReady');
    } else {
      mongoose.connect(this.mongoUrl, this.mongoOptions);
      mongoose.connection.on('error', err => {
        console.error(err);
        process.exit();
      });
    }
  }
}

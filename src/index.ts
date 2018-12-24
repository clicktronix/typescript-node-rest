import app from './App';
import { CONFIG, dataBaseConnect } from './config';

dataBaseConnect();

app.listen(CONFIG.PORT, (err: Error) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is listening on ${CONFIG.PORT}`);
});

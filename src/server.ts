import app from './App';
import { CONFIG, dataBaseConnect } from './config';

const PORT = CONFIG.PORT;
dataBaseConnect();

app.listen(PORT, (err: Error) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is listening on ${PORT}`);
});

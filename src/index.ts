import app from './App';
import { CONFIG } from './config';

app.listen(CONFIG.port, (err: Error) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is listening on ${CONFIG.port}`);
});

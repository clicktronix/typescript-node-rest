import app from './App';
import { CONFIG } from './config';

app.listen(CONFIG.port, () => {
  console.log(`Server is listening on ${CONFIG.port}`);
});

import { App } from './app';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const app = new App(process.env.PORT);
  await app.listen();
}

main();

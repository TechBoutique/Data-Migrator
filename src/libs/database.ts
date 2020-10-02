import { createPool } from 'mysql2/promise';

export async function connect(clientId: string) {
  const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: clientId,
    password: process.env.DB_PASSWORD,
  });
  return connection;
}

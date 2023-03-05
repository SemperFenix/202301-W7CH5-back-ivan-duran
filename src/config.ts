import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
  collection: process.env.DB_NAME,
  secret: process.env.DB_SECRET,
};

export const _dirname = path.dirname(fileURLToPath(import.meta.url));

import mongoose from 'mongoose';
import { config } from '../config.js';

const { user, password, cluster, collection } = config;

export const dbConnect = (env?: string) => {
  const finalEnv = env || process.env.NODE_ENV;
  const finalDBName =
    finalEnv === 'test' ? collection + '_Testing' : collection;
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${finalDBName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};

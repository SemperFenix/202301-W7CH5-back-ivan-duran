import mongoose from 'mongoose';
import { config } from '../config.js';

const { user, password, cluster, collection } = config;

export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${collection}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};

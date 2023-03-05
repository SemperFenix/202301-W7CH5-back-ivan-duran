import http from 'http';
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './db/db.connect.js';
import fs from 'fs/promises';

const debug = createDebug('W7B:index');
fs.writeFile(
  './src/log/app_log.txt',
  `**New Server session:**\n${new Date()}\n`,
  {
    encoding: 'utf-8',
  }
);

const PORT = process.env.PORT || 4742;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    debug(error);
  });

server.on('error', (error) => {
  debug('Server error: ', error.message);
});

server.on('listening', () => {
  debug('Server listening in port ', Number(PORT));
});

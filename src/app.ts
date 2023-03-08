import express, { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import morgan from 'morgan';
import cors from 'cors';
import { membersRouter } from './routers/members.router.js';
import { CustomError } from './errors/http.error.js';
import path from 'path';
import { _dirname } from './helpers/dirname.js';

const debug = createDebug('W7B:app');

export const app = express();
app.disable('x-powered-by');
debug(_dirname);
app.use(morgan('dev'));

/* _dirname nos permite entrar en el directorio de dist, esté donde esté.
Si queremos copiar carpetas que no hacen build, utilizamos copyfiles.
Tenemos que añadir además en el package json los comandos:
"prebuild": "npm run copy:public",
  "copy:public": "copyfiles -u 1 src/public/**"/*.* dist"  (Las comillas después de los asteriscos sobran)
  */
app.use(express.static(path.resolve(_dirname, 'public')));

const corsOrigins = {
  origin: '*',
};
app.use(cors(corsOrigins));
app.use(express.json());

app.use('/members', membersRouter);
app.use('/log', (_req, resp) => resp.download('./src/log/app_log.txt'));
app.use('/', (_req, resp) => {
  resp.json({
    info: 'Social Network Project',
    endpoints: {
      members: '/members',
      log: '/log',
    },
  });
});

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    const status = error.code || 500;
    const statusMessage = error.outMsg || 'Internal Server Error';
    resp.status(status);
    debug('Error: ', status, statusMessage);
    debug(error.name, ': ', error.message);

    resp.json({
      error: [{ status, statusMessage }],
    });
  }
);

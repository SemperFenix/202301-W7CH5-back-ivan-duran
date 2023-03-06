import express from 'express';
import createDebug from 'debug';
import { _dirname } from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import { membersRouter } from './routers/members.router.js';
const debug = createDebug('W7B:app');
export const app = express();
app.disable('x-powered-by');
debug(_dirname);
app.use(morgan('dev'));
app.use(express.static('public'));
const corsOrigins = {
    origin: '*',
};
app.use(cors(corsOrigins));
app.use(express.json());
app.use('/members', membersRouter);
app.use('/', (_req, resp) => {
    resp.json({
        info: 'Social Network Project',
        endpoints: {
            members: '/members',
        },
    });
});
app.use((error, _req, resp, _next) => {
    const status = error.code || 500;
    const statusMessage = error.outMsg || 'Internal Server Error';
    resp.status(status);
    debug('Error: ', status, statusMessage);
    debug(error.name, ': ', error.message);
    resp.json({
        error: [{ status, statusMessage }],
    });
});

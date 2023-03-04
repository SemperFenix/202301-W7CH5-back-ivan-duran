import express from 'express';
import createDebug from 'debug';
import { _dirname } from './config.js';
import morgan from 'morgan';
import cors from 'cors';

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
app.use('/favicon', express.static('../public/favicon.png'));

app.use('/', (_req, resp) => {
  resp.send(
    `<h1>ISDI Thirti</h1>
    <h2>Proto-proyecto de red social</h2>
    <p>Bienvenido a este challenge de fin de semana, muestra aprecio a tus amigos y deja clara la situación a tus enemigos.</p>`
  );
});

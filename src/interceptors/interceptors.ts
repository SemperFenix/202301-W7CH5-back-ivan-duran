import { NextFunction, Request, Response } from 'express';
import { Auth, TokenPayload } from '../services/auth.js';
import createDebugger from 'debug';
import { HTTPError } from '../errors/http.error.js';

const debug = createDebugger('W7B:Interceptors');

export interface CustomRequest extends Request {
  member?: TokenPayload;
}

export abstract class Interceptors {
  static logged(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Logging...');

      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(
          498,
          'Token expired/invalid',
          'No authorization header found'
        );

      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(
          498,
          'Token expired/invalid',
          'No Bearer in auth header'
        );

      const token = authHeader.slice(7);
      const tokenPayload = Auth.getTokenInfo(token);
      req.member = tokenPayload;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Comentada para futura implementación
  // static authorized() {}
}

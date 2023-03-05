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

  static async authorized(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.member)
        throw new HTTPError(498, 'Token not found', 'No member in the request');

      if (!req.body.id) req.body.id = req.params.id;

      if (req.member.id !== req.body.id)
        throw new HTTPError(401, 'Unauthorized', 'Not allowed action');
      debug('Authorized!');
      next();
    } catch (error) {
      next(error);
    }
  }
}

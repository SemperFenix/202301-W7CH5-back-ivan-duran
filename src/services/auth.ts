import jwt from 'jsonwebtoken';
import { config } from '../config';

const salt = 10;

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class Auth {
  static createToken(payload: TokenPayload) {
    // Hago aserción de tipo porque, en caso de no haber secreto, el token se genera también
    return jwt.sign(payload, config.secret as string);
  }

  static verifyToken(token: string): TokenPayload;
}

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HTTPError } from '../errors/http.error.js';
import bcrypt from 'bcryptjs';
const salt = 10;
export class Auth {
    static createToken(payload) {
        if (!config.secret)
            throw new Error('No secret');
        return jwt.sign(payload, config.secret);
    }
    static getTokenInfo(token) {
        if (!config.secret)
            throw new Error('No secret');
        const tokenInfo = jwt.verify(token, config.secret);
        if (typeof tokenInfo === 'string')
            throw new HTTPError(498, 'Invalid Token', tokenInfo);
        return tokenInfo;
    }
    static hash(value) {
        return bcrypt.hash(value, salt);
    }
    static compareHash(value, hash) {
        return bcrypt.compare(value, hash);
    }
}

import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Auth, TokenPayload } from './auth';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

jest.mock('../config', () => ({
  __dirname: 'testdir',
  config: {
    secret: 'a',
  },
}));

jest.mock('jsonwebtoken');

describe('Given the Auth class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('When call the create token method', () => {
    describe('When a secret is provided', () => {
      test('Then it should call the jwt.sign method', () => {
        Auth.createToken({ a: test } as unknown as TokenPayload);
        expect(jwt.sign).toHaveBeenCalled();
      });
    });

    describe('When a secret is not provided', () => {
      test('Then it should call the jwt.sign method', () => {
        delete config.secret;
        const token = {
          a: test,
        } as unknown as TokenPayload;
        const createToken = () => Auth.createToken(token);
        // Esta estructura es para evitar el aviso de Eslint de too many callbacks nested
        expect(createToken).toThrow();
      });
    });
  });

  describe('When call the check and return token', () => {
    describe('When a secret is not provided', () => {
      test('Then it should return', () => {
        expect(() => Auth.getTokenInfo('a')).toThrow();
      });
    });

    describe('When a secret is provided', () => {
      test('Then it should return the token info', async () => {
        config.secret = 'a';
        Auth.getTokenInfo('a');
        expect(jwt.verify).toHaveBeenCalled();
      });
    });

    describe('When the token not match', () => {
      test('Then it should throw error', () => {
        (jwt.verify as jest.Mock).mockReturnValue('test');
        expect(() => {
          Auth.getTokenInfo('a');
        }).toThrow();
      });
    });

    describe('When called the hash with correct data', () => {
      test('Then it should call the bcrypt.hash', () => {
        Auth.hash('a');
        expect(bcrypt.hash).toHaveBeenCalled();
      });
    });

    describe('When called the compare with correct data', () => {
      test('Then it should call the bcrypt.compare', () => {
        Auth.compareHash('a', 'b');
        expect(bcrypt.compare).toHaveBeenCalled();
      });
    });
  });
});

import { NextFunction, Response } from 'express';
import { Auth, TokenPayload } from '../services/auth.js';
import { CustomRequest, Interceptors } from './interceptors.js';

jest.mock('../services/auth.js');

const mockReq = {
  get: jest.fn(),
} as unknown as CustomRequest;
const mockResp = {} as Response;
const next = jest.fn() as NextFunction;

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the interceptors class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When call the logged method', () => {
    describe('When called with correct parameters', () => {
      test('Then it should call next function', () => {
        (mockReq.get as jest.Mock).mockReturnValue('Bearer test');
        (Auth.getTokenInfo as jest.Mock).mockResolvedValue({
          id: 'Test',
        } as TokenPayload);
        Interceptors.logged(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When called with no Authorization header', () => {
      test('Then it should call next function (error)', () => {
        (mockReq.get as jest.Mock).mockReturnValue(undefined);

        Interceptors.logged(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When Authorization header not start with "Bearer"', () => {
      test('Then it should call next function (error)', () => {
        (mockReq.get as jest.Mock).mockReturnValue('Test token');

        Interceptors.logged(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('When call the authorized method', () => {
    describe('When called with correct parameters', () => {
      test('Then it should call next function', () => {
        mockReq.body = { id: '1' };
        mockReq.member = { id: '1' } as unknown as TokenPayload;
        Interceptors.authorized(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When called with no req body id', () => {
      test('Then it should take req params id and call next if matches', () => {
        mockReq.body = { name: 'Test' };
        mockReq.params = { id: '1' };
        mockReq.member = { id: '1' } as unknown as TokenPayload;
        Interceptors.authorized(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When called with no matching ids', () => {
      test('Then it should call next (error)', () => {
        mockReq.body = { id: '2' };
        mockReq.member = { id: '1' } as unknown as TokenPayload;
        Interceptors.authorized(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When called with no req.member', () => {
      test('Then it should call next function (error)', () => {
        delete mockReq.member;

        Interceptors.authorized(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});

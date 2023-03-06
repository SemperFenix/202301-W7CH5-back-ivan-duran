import { Auth } from '../services/auth.js';
import { Interceptors } from './interceptors.js';
jest.mock('../services/auth.js');
const mockReq = {
    get: jest.fn(),
};
const mockResp = {};
const next = jest.fn();
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
                mockReq.get.mockReturnValue('Bearer test');
                Auth.getTokenInfo.mockResolvedValue({
                    id: 'Test',
                });
                Interceptors.logged(mockReq, mockResp, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('When called with no Authorization header', () => {
            test('Then it should call next function (error)', () => {
                mockReq.get.mockReturnValue(undefined);
                Interceptors.logged(mockReq, mockResp, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('When Authorization header not start with "Bearer"', () => {
            test('Then it should call next function (error)', () => {
                mockReq.get.mockReturnValue('Test token');
                Interceptors.logged(mockReq, mockResp, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When call the authorized method', () => {
        describe('When called with correct parameters', () => {
            test('Then it should call next function', () => {
                mockReq.body = { id: '1' };
                mockReq.member = { id: '1' };
                Interceptors.authorized(mockReq, mockResp, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('When called with no req body id', () => {
            test('Then it should take req params id and call next if matches', () => {
                mockReq.body = { name: 'Test' };
                mockReq.params = { id: '1' };
                mockReq.member = { id: '1' };
                Interceptors.authorized(mockReq, mockResp, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('When called with no matching ids', () => {
            test('Then it should call next (error)', () => {
                mockReq.body = { id: '2' };
                mockReq.member = { id: '1' };
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

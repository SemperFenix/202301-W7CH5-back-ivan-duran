import { Auth } from '../services/auth';
import { MembersController } from './members.controller.js';
jest.mock('fs/promises', () => ({
    appendFile: jest.fn().mockResolvedValue('ok'),
}));
jest.mock('../config.js', () => ({
    _dirname: 'test',
    config: {
        secret: 'test',
    },
}));
jest.mock('../services/auth.js');
const cont = '1234';
describe('Given the MembersController class', () => {
    const mockRepo = {
        query: jest.fn(),
        queryById: jest.fn(),
        create: jest.fn(),
        search: jest.fn(),
        update: jest.fn(),
        erase: jest.fn(),
    };
    const mockReq = {
        body: { email: 'Test', password: cont, id: '2' },
        member: { id: '1' },
    };
    const mockResp = {
        status: jest.fn(),
        json: jest.fn(),
    };
    const mockNext = jest.fn();
    const controller = new MembersController(mockRepo);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('When called the getAll method', () => {
        describe('When repo query returns a value', () => {
            test('Then it should call the repo query method and call resp.json', async () => {
                mockRepo.query.mockResolvedValue([]);
                await controller.getAll(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When repo query throws an error', () => {
            test('Then it should call next function', async () => {
                mockRepo.query.mockRejectedValue(undefined);
                await controller.getAll(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the register method', () => {
        describe('When all params are correct', () => {
            test('Then it should call resp.json', async () => {
                Auth.hash.mockResolvedValue('test');
                mockRepo.create.mockResolvedValue({});
                await controller.register(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When no email in req body', () => {
            test('Then it should call next', async () => {
                mockReq.body = {
                    password: cont,
                };
                await controller.register(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When no password in req body', () => {
            test('Then it should call next', async () => {
                mockReq.body = {
                    email: '123',
                };
                await controller.register(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When repo.create throws an error', () => {
            test('Then it should call next', async () => {
                mockRepo.create.mockResolvedValue(undefined);
                await controller.register(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the login method', () => {
        describe('When all params are correct', () => {
            test('Then it should call resp.json', async () => {
                mockReq.body = { email: 'Test', password: cont, id: '2' };
                Auth.compareHash.mockResolvedValue(true);
                mockRepo.search.mockResolvedValue(['a']);
                await controller.login(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When no email in req body', () => {
            test('Then it should call next', async () => {
                mockReq.body = {
                    password: cont,
                };
                await controller.login(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When no password in req body', () => {
            test('Then it should call next', async () => {
                mockReq.body = {
                    email: '123',
                };
                await controller.login(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When repo.search returns no values', () => {
            test('Then it should call next', async () => {
                mockReq.body = { email: 'Test', password: cont, id: '2' };
                mockRepo.search.mockResolvedValue([]);
                await controller.login(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When Auth.compareHash returns false', () => {
            test('Then it should call next', async () => {
                mockRepo.search.mockResolvedValue(['a']);
                Auth.compareHash.mockResolvedValue(false);
                await controller.login(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the addFriend method', () => {
        describe('When all params are correct', () => {
            test('Then it should call res.json', async () => {
                mockRepo.queryById.mockResolvedValue({
                    friends: ['test2'],
                });
                mockRepo.update.mockResolvedValue({
                    friends: 'test2',
                });
                await controller.addFriend(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When no req.member.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { name: 'Test' };
                await controller.addFriend(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When no req.body.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { id: '1' };
                mockReq.body = { email: 'Test', password: cont };
                await controller.addFriend(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        // Estos dos tests garantizan también que funcione repo.update
        describe('When logged user queryById fails', () => {
            test('Then it should call next', async () => {
                mockReq.body = { id: '2' };
                mockReq.member = { id: '1' };
                mockRepo.queryById.mockResolvedValue(undefined);
                await controller.addFriend(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the addEnemy method', () => {
        describe('When all params are correct', () => {
            test('Then it should call res.json', async () => {
                mockReq.body = { email: 'Test', password: cont, id: '2' };
                mockRepo.queryById.mockResolvedValueOnce({
                    enemies: ['test'],
                });
                mockRepo.queryById.mockResolvedValueOnce({
                    enemies: ['test2'],
                });
                mockRepo.update.mockResolvedValueOnce({
                    enemies: 'test2',
                });
                mockRepo.update.mockResolvedValueOnce({
                    enemies: 'test2',
                });
                await controller.addEnemy(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When no req.member.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { name: 'Test' };
                await controller.addEnemy(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When no req.body.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { id: '1' };
                mockReq.body = { email: 'Test', password: cont };
                await controller.addEnemy(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        // Estos dos tests garantizan también que funcione repo.update
        describe('When logged user queryById fails', () => {
            test('Then it should call next', async () => {
                mockReq.body = { id: '2' };
                mockReq.member = { id: '1' };
                mockRepo.queryById.mockResolvedValue(undefined);
                await controller.addEnemy(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the removeFriend method', () => {
        describe('When all params are correct', () => {
            test('Then it should call res.json', async () => {
                mockRepo.queryById.mockResolvedValue({
                    friends: [{ id: 'test' }, { id: 'test3' }],
                });
                mockRepo.update.mockResolvedValue({
                    friends: 'test2',
                });
                await controller.removeFriend(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When no req.member.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { name: 'Test' };
                await controller.removeFriend(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When no req.body.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { id: '1' };
                mockReq.body = { email: 'Test', password: cont };
                await controller.removeFriend(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        // Estos dos tests garantizan también que funcione repo.update
        describe('When logged user queryById fails', () => {
            test('Then it should call next', async () => {
                mockReq.body = { id: '2' };
                mockReq.member = { id: '1' };
                mockRepo.queryById.mockResolvedValue(undefined);
                await controller.removeFriend(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the removeEnemy method', () => {
        describe('When all params are correct', () => {
            test('Then it should call res.json', async () => {
                mockRepo.queryById.mockResolvedValueOnce({
                    enemies: ['test'],
                });
                mockRepo.queryById.mockResolvedValueOnce({
                    enemies: ['test2'],
                });
                mockRepo.update.mockResolvedValueOnce({
                    enemies: 'test2',
                });
                mockRepo.update.mockResolvedValueOnce({
                    enemies: 'test2',
                });
                await controller.removeEnemy(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When no req.member.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { name: 'Test' };
                await controller.removeEnemy(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When no req.body.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { id: '1' };
                mockReq.body = { email: 'Test', password: cont };
                await controller.removeEnemy(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        // Estos dos tests garantizan también que funcione repo.update
        describe('When logged user queryById fails', () => {
            test('Then it should call next', async () => {
                mockReq.body = { id: '2' };
                mockReq.member = { id: '1' };
                mockRepo.queryById.mockResolvedValue(undefined);
                await controller.removeEnemy(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the editProfile method', () => {
        describe('When all params are correct', () => {
            test('Then it should call resp.json', async () => {
                mockRepo.queryById.mockResolvedValue({});
                mockRepo.update.mockResolvedValue({});
                await controller.editProfile(mockReq, mockResp, mockNext);
                expect(mockResp.json).toHaveBeenCalled();
            });
        });
        describe('When repo.queryById fails', () => {
            test('Then it should call next', async () => {
                mockRepo.queryById.mockResolvedValue(undefined);
                await controller.editProfile(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
        describe('When there is no req.member.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { name: 'Test' };
                await controller.editProfile(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
    describe('When call the deleteMember method', () => {
        describe('When all params are correct', () => {
            test('Then it should call resp.json', async () => {
                mockReq.member = { id: 'Test' };
                mockRepo.erase.mockResolvedValue('');
                await controller.deleteMember(mockReq, mockResp, mockNext);
                expect(mockRepo.erase).toHaveBeenCalled();
            });
        });
        describe('When there is no req.member.id', () => {
            test('Then it should call next', async () => {
                mockReq.member = { name: 'Test' };
                await controller.deleteMember(mockReq, mockResp, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });
});

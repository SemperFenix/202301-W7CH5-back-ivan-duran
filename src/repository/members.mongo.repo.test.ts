import { Member } from '../entities/member.js';
import { MemberModel } from './members.mongo.model.js';
import { MemberMongoRepo } from './members.mongo.repo';

jest.mock('./members.mongo.model.ts');
const repo = MemberMongoRepo.getInstance();
let popValue: unknown;

// Creo este mock para evitar el warning de Eslint de too many callback nesting
// Asignando una variable al mockResolvedValue puedo llevar a cabo distintos tests usando el mismo mock
const mockPopulateExec = () => ({
  populate: jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(popValue),
    })),
  })),
});

const mockExec = () => ({
  exec: jest.fn().mockResolvedValue(popValue),
});

describe('Given the MembersRepo', () => {
  describe('When call the Query method', () => {
    test('Then it should return the members array', async () => {
      popValue = [{}];
      (MemberModel.find as jest.Mock).mockImplementation(mockPopulateExec);
      const result = await repo.query();
      expect(result).toEqual([{}]);
    });
  });

  describe('When call the advancedQuery method', () => {
    test('Then it should return the members array', async () => {
      popValue = [{}];
      (MemberModel.find as jest.Mock).mockImplementation(mockPopulateExec);
      const result = await repo.advancedQuery();
      expect(result).toEqual([{}]);
    });
  });

  describe('When call the queryById method', () => {
    describe('When the id returns a user', () => {
      test('Then it should return the user', async () => {
        popValue = {};
        (MemberModel.findById as jest.Mock).mockImplementation(
          mockPopulateExec
        );
        const result = await repo.queryById('1');
        expect(result).toEqual({});
      });
    });

    describe('When the id not returns a user', () => {
      test('Then it should throw error', async () => {
        popValue = undefined;
        (MemberModel.findById as jest.Mock).mockImplementation(
          mockPopulateExec
        );
        const result = repo.queryById('1');
        await expect(result).rejects.toThrow();
      });
    });
  });

  describe('When call the advancedQueryById method', () => {
    describe('When the id returns a user', () => {
      test('Then it should return the user', async () => {
        popValue = {};
        (MemberModel.findById as jest.Mock).mockImplementation(
          mockPopulateExec
        );
        const result = await repo.advancedQueryById('1');
        expect(result).toEqual({});
      });
    });

    describe('When the id not returns a user', () => {
      test('Then it should throw error', async () => {
        popValue = undefined;
        (MemberModel.findById as jest.Mock).mockImplementation(
          mockPopulateExec
        );
        const result = repo.advancedQueryById('1');
        await expect(result).rejects.toThrow();
      });
    });
  });

  describe('When called the search method', () => {
    test('Then it should return the members array', async () => {
      popValue = [{}];
      (MemberModel.find as jest.Mock).mockImplementation(mockPopulateExec);
      const result = await repo.search([
        { key: 'Test', value: 'testing' },
        { key: 'Test2', value: 'testing2' },
      ]);
      expect(result).toEqual([{}]);
    });
  });

  describe('When call the create method', () => {
    test('Then it should return the created member', async () => {
      (MemberModel.create as jest.Mock).mockResolvedValue({});
      const result = await repo.create({} as Member);
      expect(result).toEqual({});
    });
  });

  describe('When call the update method', () => {
    describe('When the user exists', () => {
      test('Then it should return the user updated', async () => {
        popValue = { name: 'Pedro' };
        (MemberModel.findByIdAndUpdate as jest.Mock).mockImplementation(
          mockExec
        );
        const result = await repo.update({ name: 'Pedro' });
        expect(result).toEqual({ name: 'Pedro' });
      });
    });

    describe('When the id not returns a user', () => {
      test('Then it should throw error', async () => {
        popValue = undefined;
        (MemberModel.findByIdAndUpdate as jest.Mock).mockImplementation(
          mockExec
        );
        const result = repo.update({ name: 'Pedro' });
        await expect(result).rejects.toThrow();
      });
    });
  });

  describe('When call the erase method', () => {
    describe('When the user exists', () => {
      test('Then it should delete the user', async () => {
        popValue = {};
        (MemberModel.findByIdAndDelete as jest.Mock).mockImplementation(
          mockExec
        );
        await repo.erase('2');
        expect(MemberModel.findByIdAndDelete).toHaveBeenCalled();
      });
    });

    describe('When the id not returns a user', () => {
      test('Then it should throw error', async () => {
        popValue = undefined;
        (MemberModel.findByIdAndDelete as jest.Mock).mockImplementation(
          mockExec
        );
        const result = repo.erase('2');
        await expect(result).rejects.toThrow();
      });
    });
  });
});

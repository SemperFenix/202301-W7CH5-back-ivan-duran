import createDebugger from 'debug';
import { MemberModel } from './members.mongo.model.js';
import { HTTPError } from '../errors/http.error.js';
const debug = createDebugger('W7B:MemberRepo');
export class MemberMongoRepo {
    static instance;
    constructor() {
        debug('Member repo instantiated...');
    }
    static getInstance() {
        if (!MemberMongoRepo.instance)
            MemberMongoRepo.instance = new MemberMongoRepo();
        return MemberMongoRepo.instance;
    }
    async query() {
        const members = await MemberModel.find()
            .populate('friends', { friends: 0, enemies: 0 })
            .populate('enemies', {
            friends: 0,
            enemies: 0,
        })
            .exec();
        debug('There you have them! =)');
        return members;
    }
    async advancedQuery() {
        const members = await MemberModel.find()
            .populate('friends')
            .populate('enemies')
            .exec();
        debug('There you have them complete! =)');
        return members;
    }
    async queryById(id) {
        const member = await MemberModel.findById(id)
            .populate('friends', { friends: 0, enemies: 0 })
            .populate('enemies', {
            friends: 0,
            enemies: 0,
        })
            .exec();
        if (!member)
            throw new HTTPError(404, 'Not found', 'User Id not found in DB');
        debug('Member found!');
        return member;
    }
    async advancedQueryById(id) {
        const member = await MemberModel.findById(id)
            .populate('friends')
            .populate('enemies')
            .exec();
        if (!member)
            throw new HTTPError(404, 'Not found', 'User Id not found in DB');
        debug('Complete member found!');
        return member;
    }
    async search(query) {
        const protoQuery = query.map((item) => ({ [item.key]: item.value }));
        const myQuery = protoQuery.reduce((obj, item) => ({ ...obj, ...item }));
        const members = await MemberModel.find({ ...myQuery })
            .populate('friends', { friends: 0, enemies: 0 })
            .populate('enemies', {
            friends: 0,
            enemies: 0,
        })
            .exec();
        debug('Search completed! =)');
        return members;
    }
    async create(entity) {
        const newMember = await MemberModel.create(entity);
        debug('New member, yaaay!');
        return newMember;
    }
    async update(entity) {
        const updatedMember = await MemberModel.findByIdAndUpdate(entity.id, entity, { new: true }).exec();
        if (!updatedMember)
            throw new HTTPError(404, 'Not found', 'Update not possible: id not found');
        debug('Member updated, noice!');
        return updatedMember;
    }
    async erase(id) {
        const erasedMember = await MemberModel.findByIdAndDelete(id).exec();
        if (!erasedMember)
            throw new HTTPError(404, 'Not found', 'Delete not possible: id not found');
    }
}

import { model, Schema } from 'mongoose';
const memberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    religion: {
        type: String,
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Member',
        },
    ],
    enemies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Member',
        },
    ],
});
memberSchema.set('toJSON', {
    transform(_document, returnedObject) {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    },
});
export const MemberModel = model('Member', memberSchema, 'members');

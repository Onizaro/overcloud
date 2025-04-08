import { Schema, model } from 'mongoose';

const recipientSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    fileId: { type: Schema.Types.ObjectId, required: true, ref: 'File' },
    email: { type: String, required: true },
}, { versionKey: false });

const recipientModel = model('Recipient', recipientSchema);

export default recipientModel;

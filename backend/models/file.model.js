
import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
    name: String,
    path: String,
    type: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

const fileModel = model('File', fileSchema);

export default fileModel;

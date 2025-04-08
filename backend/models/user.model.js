import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    verificationCode: Number,
    codeExpiration: Date,
    twoFactorFrequency: { type: String, default: 'always' }, // 'always', 'monthly', 'newDevice'
    lastTwoFactorSuccess: Date, 
    knownDevices: [String],
    token: { type: String, default: null },
    status: { type: String, default: 'alive' }, // 'alive', 'checking', 'deceased'
    lastConnection: { type: Date, default: Date.now },
}, { versionKey: false });

const userModel = model('User', userSchema);

export default userModel;
import { model, Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
    status: { type: Boolean, required: false },
  },
  { collection: 'users', versionKey: false },
);

const User = model('User', UserSchema);

export { User };

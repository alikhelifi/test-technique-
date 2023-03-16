import { User } from '../models/user';

export default async function getUser(userId) {
  return await User.findOne(
    { userId },
    { email: 1, lastName: 1, firstName: 1, userId: 1 },
  );
}

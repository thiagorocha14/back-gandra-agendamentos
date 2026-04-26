import { User } from '../../users/entity/user.entity';

export type AuthSessionUser = Pick<
  User,
  'id' | 'name' | 'email' | 'userType' | 'phone'
>;

export type AuthSessionResponse = {
  accessToken: string;
  user: AuthSessionUser;
};

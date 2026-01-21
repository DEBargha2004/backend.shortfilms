import { UserRole } from './user-role';

export type JwtPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

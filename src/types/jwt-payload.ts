import { TRole } from 'src/modules/authorization/authorization.constants';

export type JwtPayload = {
  userId: string;
  role: TRole;
  email: string;
};

export type TJwtToken = {
  sub: string;
  role: TRole;
  email: string;
  iat: number;
};

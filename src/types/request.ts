import { Request } from 'express';
import { TJwtToken } from './jwt-payload';

export interface AuthenticatedRequest extends Request {
  user: TJwtToken;
}

import * as jwt from 'jsonwebtoken';

import { UserModel } from '../../models';
import { CONFIG } from '../../config';
import { isString } from '../types/guards';

export function decodeToken(usersToken: string) {
  const token = usersToken.replace('Bearer ', '');
  const decoded = jwt.verify(token, CONFIG.jwt_encryption);
  if (!decoded || isString(decoded)) {
    throw new Error('Invalid token');
  }
  return decoded as UserModel;
}

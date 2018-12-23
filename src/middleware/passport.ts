import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStatic } from 'passport';

import User from '../models/userModel';
import { CONFIG } from '../config/config';

export function passport(passportInstance: PassportStatic) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CONFIG.jwt_encryption,
  };

  passportInstance.use(new Strategy(opts, async (jwtPayload, done) => {
    await User.findById(jwtPayload.user_id, (err: Error, res) => {
      if (err) { done(new Error(err.message), false); }
      done(null, res);
    });
  }));
}

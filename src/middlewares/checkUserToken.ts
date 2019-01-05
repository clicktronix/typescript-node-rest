import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';

import User from 'models/userModel';
import { CONFIG } from 'config';

export function checkUserToken(passportInstance: PassportStatic) {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CONFIG.jwt_encryption,
  };

  passportInstance.use(new Strategy(opts, async (jwtPayload, done) => {
    User.findById(jwtPayload.user_id, (err: Error, res) => {
      if (err) { done(new Error(err.message), false); }
      done(null, res);
    });
  }));
}

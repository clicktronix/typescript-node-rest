// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UserModel } from '../models';
// import CONFIG from '../config/config';
// import { to } from '../services/util.service';

// export function (passport: Passport) {
//   var opts = {};
//   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//   opts.secretOrKey = CONFIG.jwt_encryption;

//   passport.use(new Strategy(opts, async function (jwt_payload, done) {
//     let err, user;
//     [err, user] = await to(User.findById(jwt_payload.user_id));
//     if (err) return done(err, false);
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   }));
// }
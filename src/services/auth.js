import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user';

/**
 * JWT Strategy Auth
 */
const jwtOpts = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  // Telling Passport where to find the secret
  secretOrKey: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION,
};

const jwtLogin = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findOne(
      { userId: payload.id, status: true },
      {
        id: 1,
        email: 1,
        status: 1,
        userId: 1,
      },
    );
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(jwtLogin);

/**
 * @apiDefine JwtAuthentication
 * @apiHeader {JWT} Authorization JWT Token
 * @apiHeaderExample {json} Header-Exemple
 * {
 *  "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTBhMWI3ODAzMDI3N2NiNjQxM2JhZGUiLCJpYXQiOjE0OTM4MzQ2MTZ9.RSlMF6RRwAALZQRdfKrOZWnuHBk-mQNnRcCLJsc8zio"
 * }
 * @apiError (Errors) {401} Unauthorized The Jwt is not correct
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
export const authJwt = passport.authenticate('jwt', { session: false });

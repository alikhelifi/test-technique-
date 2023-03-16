/* @flow */

import passport from 'passport-strategy';

/**
 * Add default values to options
 *
 * @param options
 * @returns {*}
 */
const setDefaults = options => {
  const opts = options;
  opts.usernameEnv = options.usernameEnv || 'AUTO_LOGIN';
  return opts;
};

class Strategy extends passport.Strategy {
  constructor(
    options,
    verify,
  ) {
    super();
    if (!options) {
      throw new Error('EnvStrategy requires options');
    }
    if (!verify) {
      throw new TypeError('EnvStrategy requires a verify callback');
    }

    passport.Strategy.call(this);

    this.name = 'env';
    this.options = setDefaults(options);
    this.verify = verify;
  }

  authenticate(req, opts) {
    const options = opts || {};
    const username = process.env[this.options.usernameEnv];

    if (!username) {
      return this.fail(
        {
          message:
            options.badRequestMessage ||
            `Missing env variable ${this.options.usernameEnv}`,
        },
        400,
      );
    }
    return this.verify(username, (err, user, info) => {
      if (err) return this.error(err);
      if (!user) return this.fail(info);
      return this.success(user, info);
    });
  }
}
/**
 * Expose `Strategy`.
 */
export default Strategy;

import HTTPStatus from 'http-status';
// models
import passwordHash from 'password-hash';
import jwt from 'jsonwebtoken';
import { Joi } from 'celebrate';
// helpers
import {
  Error,
  formatJSONResponse,
  ROLE_ADMIN,
  ROLE_PDS,
  sendMail,
  Success,
} from '../../utils/helpres';
import APIError from '../../services/error';
import { User } from '../../models/user';

import { validationBodyResetPassword } from '../../utils/validationBody';
import { filteredBody } from '../../utils/filteredBody';
import getUser from '../../repository/user';

const requestWhiteList = {
  resetPassword: Object.keys(validationBodyResetPassword),
};

export const validation = {
  resetPassword: {
    body: Joi.object(validationBodyResetPassword),
  },
  login: {
    body: {
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          //tlds: { allow: ['com', 'net', 'tn', 'fr'] },
        })
        .required(),
      password: Joi.string()
        .min(8)
        .max(20)
        .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))
        .required(),
    },
  },
  refreshToken: {
    body: {
      token: Joi.string().required(),
    },
  },
};

export async function login(req, res, next) {
  // Generate JWT token that expired according to environment constant
  try {
    const { email, password } = req.body;

    const user = await User.findOne(
      { email },
      {
        password: 1,
        id: 1,
        email: 1,
        userId: 1,
        status: 1,
      },
    );
    if (!user) {
      throw new APIError(
        HTTPStatus.NOT_FOUND,
        Error,
        'Compte non trouvé, vérifiez votre e-mail.',
      );
    } else {
      if (user.status) {
        if (passwordHash.verify(password, user.password)) {
          const token = jwt.sign(
            {
              id: user.userId,
              email,
              status: user.status,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION },
          );
          let account = await getUser(user.userId);
          return res.status(HTTPStatus.OK).json(
            formatJSONResponse(HTTPStatus.OK, Success, "S'identifier", {
              token,
              account,
            }),
          );
        } else {
          throw new APIError(
            HTTPStatus.UNAUTHORIZED,
            Error,
            'Veuillez vérifier votre mot de passe !',
          );
        }
      } else {
        throw new APIError(
          HTTPStatus.UNAUTHORIZED,
          Error,
          "Votre compte est toujours inactif! Veuillez consulter votre boite mail pour l'activer",
        );
      }
    }
  } catch (err) {
    err.status = HTTPStatus.UNAUTHORIZED;
    return next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const decoded = jwt.verify(req.body.token, config.JWT_SECRET, {
      ignoreExpiration: true, //handled by OAuth2 server implementation
    });
    if (decoded.email) {
      const account = await User.findOne(
        { email: decoded.email },
        {
          id: 1,
          email: 1,
          status: 1,
          userId: 1,
        },
      );

      const token = jwt.sign(
        {
          id: account.userId,
          email: account.email,
          status: account.status,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION },
      );
      return res.status(HTTPStatus.OK).json(
        formatJSONResponse(HTTPStatus.OK, Success, '', {
          token,
          account: await getUser(account.userId),
        }),
      );
    }
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const { user } = req;
    let account = await User.findById(user.id);

    return res.status(HTTPStatus.OK).json(account);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

/**
 * Verification Url
 */
// eslint-disable-next-line consistent-return
export async function verification(req, res, next) {
  try {
    const { id, code } = req.params;
    const user = await User.findOne({
      verificationCode: code,
      userId: id,
    });
    if (!user) {
      throw new APIError(
        HTTPStatus.UNAUTHORIZED,
        Error,
        "Votre compte n'est pas existe",
      );
    } else {
      if (user.status) {
        throw new APIError(
          HTTPStatus.UNAUTHORIZED,
          Error,
          'Votre compte déja accepté',
        );
      } else {
        const result = await User.updateOne({ userId: id }, { status: true });
        if (!result) {
          throw new APIError(
            HTTPStatus.UNAUTHORIZED,
            Error,
            "Votre compte n'est pas accepté",
          );
        }
        return res
          .status(HTTPStatus.OK)
          .json(
            formatJSONResponse(
              HTTPStatus.OK,
              Success,
              'Votre compte est accepté',
            ),
          );
      }
    }
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

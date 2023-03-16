import HTTPStatus from 'http-status';
// models
import { Joi } from 'celebrate';
// helpers
import {
  Error,
  formatJSONResponse,
  generateCode,
  sendMail,
  Success,
} from '../../utils/helpres';
import APIError from '../../services/error';
import {
  createValidationBodyUser,
  updateValidationBodyUser,
} from '../../utils/validationBody';
import { filteredBody } from '../../utils/filteredBody';
import { User } from '../../models/user';
import passwordHash from 'password-hash';
import getUser from '../../repository/user';
const { v4 } = require('uuid');
const uuidv4 = v4;
const hostUrl = process.env.CORS_ORIGIN;

const requestWhiteList = {
  create: Object.keys(createValidationBodyUser),
  update: Object.keys(updateValidationBodyUser),
};
export const validation = {
  create: {
    body: Joi.object(createValidationBodyUser),
  },
  update: {
    body: Joi.object(updateValidationBodyUser),
    /*params: {
      id: Joi.string().required(),
    },*/
  },
};

export async function create(req, res, next) {
  try {
    const body = filteredBody(req.body, requestWhiteList.create);

    const existUser = await User.findOne({ email: body.email });
    if (existUser) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Compte ${body.email} déja existe`,
      );
    }
    let result;
    const code = generateCode();
    result = await User.create({
      ...body,
      password: passwordHash.generate(body.password),
      userId: uuidv4(),
      verificationCode: code,
      status: false,
    });
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Compte non crée');
    }
    const send = await sendMail({
      from: '',
      to: [body.email],
      type: 'signup',
      title: 'Validation du compte',
      locals: {
        name: `Bonjour`,
        url: `${hostUrl}/api/auth/verification/${result.userId}/${code}`,
      },
      subject: 'Validation du compte',
      attachments: '',
    });
    if (send) {
      return res
        .status(HTTPStatus.OK)
        .json(
          formatJSONResponse(
            HTTPStatus.CREATED,
            Success,
            'Compte a été crée avec succés',
            await getUser(result.userId),
          ),
        );
    } else {
      await User.deleteOne({ userId: result.userId });
    }
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { user } = req;
    const body = filteredBody(req.body, requestWhiteList.update);
    const existUser = await User.findOne({ userId: user.userId });
    if (!existUser) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Compte n'est pas existe`,
      );
    }
    let result;
    result = await User.updateOne(
      { userId: user.userId },
      {
        ...body,
      },
    );
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Compte non modifié');
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Compte a été modifié avec succés',
          await getUser(user.userId),
        ),
      );
  } catch (err) {
    err.status = HTTPStatus.INTERNAL_SERVER_ERROR;
    return next(err);
  }
}

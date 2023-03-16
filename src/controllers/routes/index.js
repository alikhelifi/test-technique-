import HTTPStatus from 'http-status';
// models
import { Joi } from 'celebrate';
// helpers
import {
  Error,
  formatJSONResponse,
  generateCode,
  removeDuplicates,
  sendMail,
  Success,
} from '../../utils/helpres';
import APIError from '../../services/error';
import {
  createValidationBodyRoute,
  updateValidationBodyRoute,
} from '../../utils/validationBody';
import { filteredBody } from '../../utils/filteredBody';
import { User } from '../../models/user';
import passwordHash from 'password-hash';
import getUser from '../../repository/user';
import { Route } from '../../models/route';
import { UserReservation } from '../../models/user-reservation';
import tickets from '../../routes/tickets';
import { Ticket } from '../../models/ticket';
const { v4 } = require('uuid');
const uuidv4 = v4;
const hostUrl = process.env.CORS_ORIGIN;

const requestWhiteList = {
  create: Object.keys(createValidationBodyRoute),
  update: Object.keys(updateValidationBodyRoute),
};
export const validation = {
  create: {
    body: Joi.object(createValidationBodyRoute),
  },
  update: {
    body: Joi.object(updateValidationBodyRoute),
    /*params: {
          id: Joi.string().required(),
        },*/
  },
};

export async function getAvailableRoutesTickets(req, res, next) {
  try {
    let result;
    const routes = await Route.find({ status: true });
    let existRouteTickets = [];
    if (routes && routes.length > 0) {
      for await (let route of routes) {
        existRouteTickets.push({
          routeId: route.routeId,
          routeStart: route.routeStart,
          routeEnd: route.routeEnd,
          nbrSeatList: route.seatList - (parseInt(route.nbrSeatList) || 0),
        });
      }
    }

    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(HTTPStatus.CREATED, Success, '', existRouteTickets),
      );
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function create(req, res, next) {
  try {
    const body = filteredBody(req.body, requestWhiteList.create);

    let result;

    result = await Route.create({
      ...body,
      routeId: uuidv4(),
      status: true,
    });
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Route non crée');
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Route a été crée avec succés',
          result,
        ),
      );
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { user } = req;
    const body = filteredBody(req.body, requestWhiteList.update);
    const existRoute = await Route.findOne({ routeId: body.routeId });
    if (!existRoute) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Route n'est pas existe`,
      );
    }
    let result;

    result = await Route.updateOne(
      { routeId: body.routeId },
      {
        ...body,
      },
    );
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Route non modifié');
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Route a été modifié avec succés',
          await Route.findOne({ routeId: body.routeId }),
        ),
      );
  } catch (err) {
    err.status = HTTPStatus.INTERNAL_SERVER_ERROR;
    return next(err);
  }
}

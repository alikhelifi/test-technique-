import HTTPStatus from 'http-status';
// models
import { Joi } from 'celebrate';
// helpers
import { Error, formatJSONResponse, Success } from '../../utils/helpres';
import APIError from '../../services/error';
import {
  createValidationBodyTicket,
  updateValidationBodyTicket,
} from '../../utils/validationBody';
import { filteredBody } from '../../utils/filteredBody';
import { Route } from '../../models/route';
import { Ticket } from '../../models/ticket';
import { UserReservation } from '../../models/user-reservation';
const { v4 } = require('uuid');
const uuidv4 = v4;

const requestWhiteList = {
  create: Object.keys(createValidationBodyTicket),
  update: Object.keys(updateValidationBodyTicket),
};
export const validation = {
  create: {
    body: Joi.object(createValidationBodyTicket),
  },
  update: {
    body: Joi.object(updateValidationBodyTicket),
    /*params: {
              id: Joi.string().required(),
            },*/
  },
};

export async function getAvailableTickets(req, res, next) {
  try {
    let result;
    const { routeId } = req.params;
    const existRoute = await Route.findOne({ routeId, status: true });
    if (!existRoute) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Route n'est pas existe`,
      );
    }
    result = await UserReservation.find(
      {
        routeId,
      },
      { tickets: 1 },
    );
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Route non crée');
    }
    let tickets = [];
    if (result && result.length > 0) {
      for await (let item of result) {
        tickets.push(...item.tickets);
      }
    }
    let existTickets;
    console.log(tickets)
    if (tickets.length > 0) {
      existTickets = await Ticket.find({
        routeId,
        ticketId: { $nin: tickets },
      });
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Billets disponibles pour le trajet',
          existTickets,
        ),
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

    result = await Ticket.create({
      ...body,
      ticketId: uuidv4(),
      status: true,
    });
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Billet  non crée');
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Billet a été crée avec succés',
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
    const existRoute = await Ticket.findOne({ routeId: body.routeId });
    if (!existRoute) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Billet n'est pas existe`,
      );
    }
    let result;

    result = await Ticket.updateOne(
      { ticketId: body.ticketId },
      {
        ...body,
      },
    );
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Billet non modifié');
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Billet a été modifié avec succés',
        ),
      );
  } catch (err) {
    err.status = HTTPStatus.INTERNAL_SERVER_ERROR;
    return next(err);
  }
}

import HTTPStatus from 'http-status';
// models
import { Joi } from 'celebrate';
// helpers
import {
  Error,
  formatJSONResponse,
  sendMail,
  Success,
} from '../../utils/helpres';
import APIError from '../../services/error';
import {
  createValidationBodyReservation,
  updateValidationBodyReservation,
} from '../../utils/validationBody';
import { filteredBody } from '../../utils/filteredBody';
import { Route } from '../../models/route';
import { UserReservation } from '../../models/user-reservation';
import getUserReservation from '../../repository/reservation';
import { Ticket } from '../../models/ticket';

const { v4 } = require('uuid');
const uuidv4 = v4;

const requestWhiteList = {
  create: Object.keys(createValidationBodyReservation),
  update: Object.keys(updateValidationBodyReservation),
};
export const validation = {
  create: {
    body: Joi.object(createValidationBodyReservation),
  },
  update: {
    body: Joi.object(updateValidationBodyReservation),
    /*params: {
          id: Joi.string().required(),
        },*/
  },
};
/**
 * Create User Reservation
 */
export async function create(req, res, next) {
  try {
    const { user } = req;
    const body = filteredBody(req.body, requestWhiteList.create);

    const existRoute = await Route.findOne({ routeId: body.routeId });
    if (!existRoute) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, `Trajet n'existe pas`);
    }
    let result;
    const tickets = body.tickets;
    if (tickets && tickets.length > 0) {
      for await (let ticket of tickets) {
        const existTicketInRoute = await Ticket.findOne({
          routeId: body.routeId,
          ticketId: ticket,
        });
        if (!existTicketInRoute) {
          throw new APIError(
            HTTPStatus.BAD_REQUEST,
            Error,
            `Billet n'existe pas dans le trajet`,
          );
        }
      }
    }
    result = await UserReservation.create({
      userReservationId: uuidv4(),
      userId: user.userId,
      routeId: body.routeId,
      tickets: body.tickets,
      creationDate: new Date(),
      status: true,
    });
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Reservation non crée');
    }
    const send = await sendMail({
      from: '',
      to: [user.email],
      type: 'sendReiniPwd',
      title: 'Creation Reservation',
      locals: {
        name: `Bonjour`,
        message: 'Vous avez reservé un trajet',
        //url: `${hostUrl}/api/auth/verification/${result.userId}/${code}`,
      },
      subject: 'Creation Reservation',
      attachments: '',
    });
    if (send) {
      console.log((existRoute.nbrSeatList || 0) + parseInt(tickets.length));
      const updateRoute = await Route.updateOne(
        { routeId: body.routeId },
        {
          nbrSeatList: (existRoute.nbrSeatList || 0) + parseInt(tickets.length),
        },
      );
      if (!updateRoute) {
        throw new APIError(
          HTTPStatus.BAD_REQUEST,
          Error,
          `Trajet n'existe pas`,
        );
      }
      return res
        .status(HTTPStatus.OK)
        .json(
          formatJSONResponse(
            HTTPStatus.CREATED,
            Success,
            'Reservation a été crée avec succés',
            await getUserReservation(result.userReservationId),
          ),
        );
    } else {
      await UserReservation.deleteOne({
        userReservationId: result.userReservationId,
      });
    }
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
/**
 * Cancel Reservation
 */
export async function cancel(req, res, next) {
  try {
    const { user } = req;
    const { userReservationId } = req.params;

    const existUserReservation = await UserReservation.findOne({
      userReservationId,
    });
    if (!existUserReservation) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Reservation n'existe pas`,
      );
    }
    let result;
    result = await UserReservation.updateOne(
      {
        userReservationId,
        userId: user.userId,
      },
      { status: false },
    );
    if (!result) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, 'Reservation non crée');
    }
    const send = await sendMail({
      from: '',
      to: [user.email],
      type: 'sendReiniPwd',
      title: 'Annulation Reservation',
      locals: {
        name: `Bonjour`,
        message: 'Vous avez annulé une reservations',
        //url: `${hostUrl}/api/auth/verification/${result.userId}/${code}`,
      },
      subject: 'Annulation Reservation',
      attachments: '',
    });
    if (send) {
      return res
        .status(HTTPStatus.OK)
        .json(
          formatJSONResponse(
            HTTPStatus.CREATED,
            Success,
            'Reservation a été annulé avec succés',
            await getUserReservation(userReservationId),
          ),
        );
    } else {
      await UserReservation.deleteOne({ userReservationId });
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
    const existReservation = await UserReservation.findOne({
      userReservationId: body.userReservationId,
      userId: user.userId,
    });
    if (!existReservation) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        `Reservation n'existe pas`,
      );
    }
    const existRoute = await Route.findById(body.routeId);
    if (existRoute) {
      throw new APIError(HTTPStatus.BAD_REQUEST, Error, `Trajet n'existe pas`);
    }
    let result;
    result = await UserReservation.updateOne(
      { userReservationId: body.userReservationId, userId: user.userId },
      {
        routeId: body.routeId,
        tickets: body.tickets,
        status: body.status,
      },
    );
    if (!result) {
      throw new APIError(
        HTTPStatus.BAD_REQUEST,
        Error,
        'Reservation non modifié',
      );
    }
    return res
      .status(HTTPStatus.OK)
      .json(
        formatJSONResponse(
          HTTPStatus.CREATED,
          Success,
          'Reservation a été modifié avec succés',
          await getUserReservation(body.userReservationId),
        ),
      );
  } catch (err) {
    err.status = HTTPStatus.INTERNAL_SERVER_ERROR;
    return next(err);
  }
}

/**
 * Tickets Routes
 */

import { Router } from 'express';
import * as TicketsController from '../../controllers/tickets/index';
import { celebrate } from 'celebrate';
import { authJwt } from '../../services/auth';
import { Joi } from 'celebrate';

const routes = new Router();

/**
 * Create Ticket
 */
routes.get(
  '/getAvailableTickets/:routeId',
  authJwt,
  celebrate({
    params: {
      routeId: Joi.string().required(),
    },
  }),
  TicketsController.getAvailableTickets,
);

/**
 * Create Ticket
 */
routes.post(
  '/create',
  authJwt,
  celebrate(TicketsController.validation.create),
  TicketsController.create,
);

/**
 * Update Ticket
 */
routes.patch(
  '/update',
  authJwt,
  celebrate(TicketsController.validation.update),
  TicketsController.update,
);

export default routes;

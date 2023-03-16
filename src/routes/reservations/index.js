/**
 * Reservations Routes
 */

import { Router } from 'express';
import * as ReservationsController from '../../controllers/reservations/index';
import { celebrate } from 'celebrate';
import { authJwt } from '../../services/auth';
const routes = new Router();

/**
 * Create Reservation
 */
routes.post(
  '/create',
  authJwt,
  celebrate(ReservationsController.validation.create),
  ReservationsController.create,
);

/**
 * Cancel Reservation
 */
routes.post(
  '/cancel/:userReservationId',
  authJwt,
  ReservationsController.cancel,
);

/**
 * Update Reservation
 */
routes.patch(
  '/update',
  authJwt,
  celebrate(ReservationsController.validation.update),
  ReservationsController.update,
);

export default routes;

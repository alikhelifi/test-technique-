/**
 * Routes Routes
 */

import { Router } from 'express';
import * as RoutesController from '../../controllers/routes/index';
import { celebrate } from 'celebrate';
import { authJwt } from '../../services/auth';
import { getAvailableRoutesTickets } from '../../controllers/routes/index';
const routes = new Router();

/**
 * get Available Routes Tickets
 */
routes.get(
  '/getAvailableRoutesTickets',
  authJwt,
  RoutesController.getAvailableRoutesTickets,
);
/**
 * Create Route
 */
routes.post(
  '/create',
  authJwt,
  celebrate(RoutesController.validation.create),
  RoutesController.create,
);

/**
 * Update Route
 */
routes.patch(
  '/update',
  authJwt,
  celebrate(RoutesController.validation.update),
  RoutesController.update,
);

export default routes;

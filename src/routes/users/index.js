/**
 * Users Routes
 */

import { Router } from 'express';
import * as UsersController from '../../controllers/users/index';
import { celebrate } from 'celebrate';
import { authJwt } from '../../services/auth';
const routes = new Router();

/**
 * Create User
 */
routes.post(
  '/create',
  celebrate(UsersController.validation.create),
  UsersController.create,
);
/**
 * Update User
 */
routes.patch(
  '/update',
  authJwt,
  celebrate(UsersController.validation.update),
  UsersController.update,
);

export default routes;

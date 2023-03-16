import express from 'express';
import HTTPStatus from 'http-status';
import { errors } from 'celebrate';
import APIError from '../services/error';
import AuthRoutes from './auth';
import UsersRoutes from './users';
import ReservationsRoutes from './reservations';
import TicketsRoutes from './tickets';
import RoutesRoutes from './routes';

// Middlewares
import logErrorService from '../services/log';

const routes = express.Router();

routes.use('/auth', AuthRoutes);
routes.use('/users', UsersRoutes);
routes.use('/reservations', ReservationsRoutes);
routes.use('/tickets', TicketsRoutes);
routes.use('/routes', RoutesRoutes);

routes.all('*', (req, res, next) =>
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true)),
);

routes.use(logErrorService);

routes.use(errors());

export default routes;

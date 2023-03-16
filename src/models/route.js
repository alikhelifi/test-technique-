import { model, Schema } from 'mongoose';

const RouteSchema = new Schema(
  {
    routeId: { type: String, required: true },
    routeStart: { type: String, required: true },
    routeEnd: { type: String, required: true },
    status: { type: Boolean, required: false },
    seatList: { type: Number, required: true },
    nbrSeatList: { type: Number, required: false },
  },
  { collection: 'routes', versionKey: false },
);

const Route = model('Route', RouteSchema);

export { Route };

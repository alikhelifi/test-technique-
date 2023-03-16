import { model, Schema } from 'mongoose';

const UserReservationSchema = new Schema(
  {
    userId: { type: String, required: true },
    userReservationId: { type: String, required: true },
    routeId: { type: String, required: true },
    tickets: { type: Array, required: true },
    status: { type: Boolean, required: false },
    creationDate: { type: Date, required: false },
  },
  { collection: 'user-reservations', versionKey: false },
);

const UserReservation = model('UserReservation', UserReservationSchema);

export { UserReservation };

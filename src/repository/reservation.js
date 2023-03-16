import { UserReservation } from '../models/user-reservation';

export default async function getUserReservation(userReservationId) {
  return await UserReservation.findOne(
    { userReservationId },
    { userReservationId: 1, routeId: 1, tickets: 1, status: 1 },
  );
}

import { model, Schema } from 'mongoose';
import { Double } from 'mongodb';

const TicketSchema = new Schema(
  {
    ticketId: { type: String, required: true },
    routeId: { type: String, required: true },
    date: { type: String, required: true },
    number: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: false },
  },
  { collection: 'tickets', versionKey: false },
);

const Ticket = model('Ticket', TicketSchema);

export { Ticket };

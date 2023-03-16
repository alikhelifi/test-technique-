import * as request from 'supertest';
import app from '../../app';
const { v4 } = require('uuid');
const uuidv4 = v4;
app.init();
describe('Endpoints', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .send({
        userId: uuidv4(),
        email: 'test@test.com',
        lastName: 'test',
        fistName: 'test',
        password: 'test',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('post');
  });
  it('should create a new route', async () => {
    const res = await request(app)
      .post('/api/routes/create')
      .send({
        routeId: uuidv4(),
        routeStart: 'Tunis',
        routeEnd: 'Paris',
        seatList: 50,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('post');
  });
  it('should create a new ticket', async () => {
    const res = await request(app)
      .post('/api/tickets/create')
      .send({
        ticketId: uuidv4(),
        routeId: 'b0e71285-e1cf-4de7-8ae1-5b141c1bf2be',
        date: new Date(),
        number: 1,
        price: 150.88,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('post');
  });
  it('should create a new reservation', async () => {
    const res = await request(app)
      .post('/api/reservation/create')
      .send({
        userId: '4c42d139-5fec-4248-9a72-a75ab5bcf453',
        userReservationId: uuidv4(),
        routeId: 'b0e71285-e1cf-4de7-8ae1-5b141c1bf2be',
        tickets: ['cdca53a9-c291-4421-b79f-40704c98b1db'],
        creationDate: new Date(),
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('post');
  });
});

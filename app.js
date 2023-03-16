import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
// This will be our application entry. We'll setup our server here.
import http from 'http';
const session = require('express-session');
import passport from 'passport';
import log from './src/services/log';
import chalk from 'chalk';
import path from 'path';
import mongoose from 'mongoose';
import ApiRoutes from './src/routes';

/*cron.schedule('* * 1 * *', async function() {
  await addPayment();
});*/
const cors = require('cors');
// Set up the express app
const app = express();
app.use(cors());
const url = process.env.MONGODB_URL;
// Prints "MongoServerError: bad auth Authentication failed."
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(url, config);

const server = http.createServer(app);
app.use(
  session({
    key: 'test',
    proxy: 'true',
    accountId: null,
    secret: 'keyboard cat',
  }),
);

// Log requests to the console.
app.use(logger('dev'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/api', ApiRoutes);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

app.use('/doc', express.static(path.resolve(process.cwd(), 'doc')));
app.use('/public', express.static(path.resolve(process.cwd(), 'public')));

// Setup a default catch-all route that sends back a welcome message in JSON format.
/*app.get('*', (req, res) => {
  res.status(200).send({
    message: 'Welcome to Dokatis',
  });
});*/

app.get('/fail', (req, res) => {
  res.status(200).send({
    message: 'Error',
  });
});

const port = parseInt(process.env.PORT, 10) || 4000;
app.set('port', port);

server.listen(port, err => {
  if (err) {
    console.log(chalk.green.bold('Cannot run!'));
  } else {
    console.log(chalk.green.bold(new Date()));
    console.log(
      chalk.green.bold(
        `
          Yep this is working 🍺
          App listen on port: ${port} 🍕
          Env: ${process.env.NODE_ENV || 'none'} 🦄
        `,
      ),
    );
  }
});

export default app;

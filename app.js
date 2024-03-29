require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

/* Connect to Database */

const dbUrl = process.env.DB_URL;
mongoose.connection.on('connected', () =>
  console.log(`Mongoose connected to ${dbUrl}`)
);
mongoose.connection.on('disconnected', () =>
  console.log('Mongoose disconnected.')
);
mongoose.connect(dbUrl);

/* Configure Express */

const loginController = require('./routes/login.controller');
const usersController = require('./routes/users.controller');
const unitsController = require('./routes/units.controller');
const ticketsController = require('./routes/tickets.controller');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/login', loginController);

const auth = require('./auth');
app.use(auth.passport.initialize());
app.use(
  '/api/',
  auth.passport.authenticate('jwt', {
    session: false,
    failWithError: true
  })
);

app.use('/api/users', usersController);
app.use('/api/units', unitsController);
app.use('/api/tickets', ticketsController);

// Support for Angular's path location strategy -- request to any nonexistent
// page will receive /public/index.html except for API calls.
app.all('*', function(req, res, next) {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).end();
  } else {
    res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
  }
});

// Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

/* Shutdown */

async function shutdown(callback) {
  await mongoose.disconnect();
  if (callback) callback();
  else process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', () => {
  shutdown(() => process.kill(process.pid, 'SIGUSR2'));
});

module.exports = app;

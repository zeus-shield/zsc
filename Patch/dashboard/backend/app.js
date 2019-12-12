'use strict';

// const debug = require('debug')('backend:server');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');
const log4js = require('log4js');
const mongoose = require('mongoose');
const app = express();

const { settings, logConfig } = require('./config');
const routes = require('./app/routes');

/**
 * Normalize a port into a number, string, or false.
 */
function _normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

log4js.configure(logConfig)
global.logger = log4js.getLogger();

// Connect to database
// Replace mongoose's promise with ES6's promise
// mongoose.Promise = global.Promise
// After mongodb is upgraded to 4.0, 'useNewUrlParser' parameter and 'useCreateIndex' parameter need to be added
mongoose.connect(settings.dbConfig.URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }).then(
  () => {
    debug('Dashboard mongoose connected!');
  },
  err => {
    debug('Dashboard mongoose connect error(%s)!', err);
  });
// mongoose.set('debug', settings.mongooseDebug)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let options = {
  origin: settings.dbConfig.ORIGIN,
  credentials: true
};
app.use(cors(options));
// app.use('/', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8085");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));

routes(app);

/**
 * Get port from environment and store in Express.
 */
let port = _normalizePort(process.env.PORT || '3000');
app.listen(port, () => debug('Dashboard backend listening on port %s!', port));

module.exports = app;

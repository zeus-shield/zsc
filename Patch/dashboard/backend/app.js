'use strict'

const debug = require('debug')('backend:server');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const log4js = require('log4js');
const {settings, logConfig} = require('./config');

const app = express();
const routes = require('./app/routes');

const mongoose = require('mongoose');

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

// ¨¢??¨®¨ºy?Y?a
// ??mongoose¡Á?¨¦¨ª¦Ì?promise¨¬?¡ä¨²?aES6¦Ì?promise
// mongoose.Promise = global.Promise
// MongoDB¨¦y??¦Ì?4.0??o¨®¡ê?D¨¨¨°a?¨®useNewUrlParser2?¨ºyo¨ªuseCreateIndex2?¨ºy
mongoose.connect(settings.dbConfig.URL, { useNewUrlParser: true, useCreateIndex: true }).then(
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
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;

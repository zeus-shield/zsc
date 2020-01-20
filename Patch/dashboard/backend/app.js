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

/**
 * Event listener for HTTP/HTTPS server "listening" event.
 */
function _onListening(type) {
  let addr;
  if (type === 'HTTPS') {
    addr = httpsServer.address();
  } else {
    addr = httpServer.address();
  }
  // logger.info(addr);
  if (addr !== null) {
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    global.logger.info(' Listening on ' + bind + '[' + type + ']');
  } else {
    global.logger.info('Listening on null' + '[' + type + ']');
  }
}

/**
 * Event listener for HTTP/HTTPS server "error" event.
 */
function _onError(type, error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind;
  if (type === 'HTTPS') {
    bind = typeof httpsPort === 'string'
      ? 'Pipe ' + httpsPort
      : 'Port ' + httpsPort;
  } else {
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      global.logger.error(bind + ' requires elevated privileges' + '[' + type + ']');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      global.logger.error(bind + ' is already in use' + '[' + type + ']');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function _onHTTPListening() {
  _onListening('HTTP');
}

function _onHTTPSListening() {
  _onListening('HTTPS');
}

function _onHTTPError(error) {
  _onError('HTTP', error);
}

function _onHTTPSError(error) {
  _onError('HTTPS', error);
}

log4js.configure(logConfig);
global.logger = log4js.getLogger();

// Connect to database
// Replace mongoose's promise with ES6's promise
// mongoose.Promise = global.Promise
// After mongodb is upgraded to 4.0, 'useNewUrlParser' parameter and 'useCreateIndex' parameter need to be added
mongoose.connect(settings.dbConfig.URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }).then(() => {
  global.logger.info('Dashboard mongoose connected!');
}).catch((err) => {
  global.logger.error('Dashboard mongoose connect error(%s)!', err);
});
// mongoose.set('debug', settings.mongooseDebug)

// app.use(logger('dev'));
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
// let port = _normalizePort(process.env.PORT || '3000');
// app.listen(port, () => logger.info('Dashboard backend listening on port %s!', port));

// http server
const httpServer = require('http').createServer(app);
const httpPort = _normalizePort(process.env.PORT || '3000');
httpServer.listen(httpPort);
httpServer.on('error', _onHTTPError);
httpServer.on('listening', _onHTTPListening);

// https server
const fs = require('fs');
const httpsServer = require('https').createServer({
  key: fs.readFileSync('./cert/3166507_bakerjiang.website.key'),
  cert: fs.readFileSync('./cert/3166507_bakerjiang.website.pem')}, app);
const httpsPort = _normalizePort(process.env.PORT || '3001');
httpsServer.listen(httpsPort);
httpsServer.on('error', _onHTTPSError);
httpsServer.on('listening', _onHTTPSListening);

module.exports = app;

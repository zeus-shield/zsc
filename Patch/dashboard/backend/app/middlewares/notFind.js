'use strict';

const createError = require('http-errors');

// catch 404 and forward to error handler
module.exports = (req, res, next) => {
  global.logger.error('notFind');
  next(createError(404, 'ROUTE_NOT_EXIST'));
};
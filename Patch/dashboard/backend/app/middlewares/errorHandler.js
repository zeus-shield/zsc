'use strict'

const debug = require('debug')('backend:app:middlewares:errorHandler');

// error handler
module.exports = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.sendErr(err);
};
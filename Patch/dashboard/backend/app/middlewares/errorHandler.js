'use strict';

// error handler
// module.exports = (err, req, res, next) => {
module.exports = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.sendErr(err);
};
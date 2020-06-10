'use strict';

const controllers = require('../controllers');

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  app.route('/token/add').post(wrap(controllers.token.add));
  app.route('/token/remove').post(wrap(controllers.token.remove));
  app.route('/token/update').post(wrap(controllers.token.update));
};

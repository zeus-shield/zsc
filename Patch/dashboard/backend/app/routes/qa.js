'use strict';

const controllers = require('../controllers');

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  app.route('/qa/add').post(wrap(controllers.qa.add));
  app.route('/qa/remove').post(wrap(controllers.qa.remove));
  app.route('/qa/removeAll').post(wrap(controllers.qa.removeAll));
  app.route('/qa/update').post(wrap(controllers.qa.update));
};

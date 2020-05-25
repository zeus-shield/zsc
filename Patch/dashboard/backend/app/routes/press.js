'use strict';

const controllers = require('../controllers');

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  app.route('/press/add').post(wrap(controllers.press.add));
  app.route('/press/remove').post(wrap(controllers.press.remove));
  app.route('/press/removeAll').post(wrap(controllers.press.removeAll));
  app.route('/press/update').post(wrap(controllers.press.update));
};

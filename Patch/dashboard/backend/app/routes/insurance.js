'use strict';

const controllers = require('../controllers');

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  app.route('/insurance').get(wrap(controllers.insurance.list));
  app.route('/insurance/count').get(wrap(controllers.insurance.count));
  app.route('/insurance/detail').get(wrap(controllers.insurance.detail));
};
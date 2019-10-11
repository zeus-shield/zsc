'use strict';

const controllers = require('../controllers');

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  app.route('/company').get(wrap(controllers.company.list));
  app.route('/company/detail').get(wrap(controllers.company.detail));
  app.route('/company/groupCategoriesByName').get(wrap(controllers.company.groupCategoriesByName));
  app.route('/company/add').post(wrap(controllers.company.add));
  app.route('/company/remove').post(wrap(controllers.company.remove));
  app.route('/company/removeCategory').post(wrap(controllers.company.removeCategory));
  app.route('/company/update').post(wrap(controllers.company.update));
};

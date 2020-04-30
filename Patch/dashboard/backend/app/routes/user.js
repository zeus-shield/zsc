'use strict';

const controllers = require('../controllers');

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  app.route('/user').get(wrap(controllers.user.list));
  app.route('/user/detail')
    .get(wrap(controllers.user.detail));
  // .put(controllers.user.update)
  // .delete(controllers.user.destroy)
  app.route('/user/remove').post(wrap(controllers.user.remove));
  app.route('/user/update').post(wrap(controllers.user.update));
  app.route('/user/setTOTP').post(wrap(controllers.user.setTOTP));
  app.route('/user/saveTOTP').post(wrap(controllers.user.saveTOTP));
  app.route('/user/updateTOTP').post(wrap(controllers.user.updateTOTP));
  app.route('/user/addPolicy').post(wrap(controllers.user.addPolicy));
  app.route('/user/removeAllPolicies').post(wrap(controllers.user.removeAllPolicies));
};
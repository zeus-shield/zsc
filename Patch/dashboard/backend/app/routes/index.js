'use strict'

const controllers = require('../controllers');
const middlewares = require('../middlewares');
const middlewaresArr = [middlewares.verifyToken, middlewares.log];

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  // res extend
  app.use(middlewares.resExtend);
  app.post('/user/emailCode', wrap(controllers.user.emailCode));
  app.post('/user/signUp', wrap(controllers.user.signUp));
  app.post('/user/login', wrap(controllers.user.login));
  app.use(middlewaresArr);
  require('./user')(app);
  require('./category')(app);
  require('./article')(app);
  app.route('/upload').post(Controllers.article.upload);
  app.route('/test').post(Controllers.test.testResponse);
  app.post(Controllers.test.test);
  // catch 404 and forward to error handler
  app.use(middlewares.notFind);

  // error handler
  app.use(middlewares.errorHandler);
};
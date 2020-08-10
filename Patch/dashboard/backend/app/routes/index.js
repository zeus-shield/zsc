'use strict';

const controllers = require('../controllers');
const apis = require('../apis');

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
  app.route('/statistics').get(wrap(controllers.user.statistics));

  app.route('/company').get(wrap(controllers.company.list));

  app.route('/insurance').get(wrap(controllers.insurance.list));

  app.route('/qa/getAll').get(wrap(controllers.qa.getAll));
  app.route('/qa/get').get(wrap(controllers.qa.get));
  app.route('/qa/getByIndex').get(wrap(controllers.qa.getByIndex));
  app.route('/qa/count').get(wrap(controllers.qa.count));

  app.route('/press/getAll').get(wrap(controllers.press.getAll));
  app.route('/press/get').get(wrap(controllers.press.get));
  app.route('/press/getByIndex').get(wrap(controllers.press.getByIndex));
  app.route('/press/count').get(wrap(controllers.press.count));

  app.route('/token/list').get(wrap(controllers.token.list));
  app.route('/token/detail').get(wrap(controllers.token.detail));
  app.route('/token/count').get(wrap(controllers.token.count));

  app.route('/iot/tableCount').get(wrap(controllers.iot.tableCount));
  app.route('/iot/tableName').get(wrap(controllers.iot.tableName));
  // api
  app.route('/scan/balance').get(wrap(apis.scan.balance));
  app.route('/scan/token').get(wrap(apis.scan.token));
  app.route('/scan/tokens').get(wrap(apis.scan.tokens));
  app.route('/scan/rate').get(wrap(apis.scan.rate));
  app.route('/scan/rateFromAddr').get(wrap(apis.scan.rateFromAddr));

  app.use(middlewaresArr);

  require('./user')(app);
  require('./company')(app);
  require('./insurance')(app);
  require('./ether')(app);
  require('./qa')(app);
  require('./press')(app);
  require('./token')(app);

  // catch 404 and forward to error handler
  app.use(middlewares.notFind);

  // error handler
  app.use(middlewares.errorHandler);
};
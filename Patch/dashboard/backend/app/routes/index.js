'use strict'

const controllers = require('../controllers');
const middlewares = require('../middlewares');
const middlewaresArr = [middlewares.verifyToken, middlewares.log];

// const wrap = fn => (...args) => fn(...args).catch(args[2]); // req, res, next
const wrap = fn => (...args) => fn(...args).catch(err => {args[1].sendErr(err);});

module.exports = (app) => {
  // res extend
  app.use(middlewares.resExtend);
};
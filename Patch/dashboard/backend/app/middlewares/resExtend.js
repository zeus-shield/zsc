'use strict';
const debug = require('debug')('backend:app:middlewares:resExtend');
const {resHandler} = require('../utils');

module.exports = (req, res, next) => {
  res.sendOk = (data) => {
    const rst = {
      status: 200,
      errorCode: 0,
      content: data
    };
    logger.info(`traceId: ${req.headers.traceId}`);
    logger.info(`method: [${req.method}] req-url: ${req.url}`);
    // logger.info(`req-headers: ${JSON.stringify(req.headers)}`);
    logger.info(`req-query: ${JSON.stringify(req.query)}`);
    logger.info(`req-params: ${JSON.stringify(req.params)}`);
    // if (req.url !== '/user/login') {
    logger.info(`req-body: ${JSON.stringify(req.body)}`);
    // }
    logger.info(`sendOk: ${JSON.stringify(data)}`);
    res.status(200).send(rst);
  }
  res.sendErr = (err) => {
    res.status(errRes.status || 500).send(errRes);
  }
  next();
};
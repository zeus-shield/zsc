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
    logger.error(`error: [name:${err.name}][message:${err.message}][status:${err.status}]`);
    const errRes = resHandler.getErrorRes(err);
    logger.error(`traceId: ${req.headers.traceId}`);
    logger.error(`method: [${req.method}] req-url: ${req.url}`);
    logger.error(`req-query: ${JSON.stringify(req.query)}`);
    logger.error(`req-params: ${JSON.stringify(req.params)}`);
    logger.error(`req-body: ${JSON.stringify(req.body)}`);
    logger.error(`sendErr: ${JSON.stringify(errRes)}`);
    res.status(errRes.status || 500).send(errRes);
  }
  next();
};
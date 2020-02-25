'use strict';

const { resHandler } = require('../utils');

module.exports = (req, res, next) => {
  res.sendOk = (data) => {
    const rst = {
      status: 200,
      errorCode: 0,
      content: data // This attribute determines success or failure
    };
    global.logger.debug(`traceId: ${req.headers.traceId}`);
    global.logger.info(`method: [${req.method}] req-url: ${req.url}`);
    // logger.debug(`req-headers: ${JSON.stringify(req.headers)}`);
    global.logger.debug(`req-query: ${JSON.stringify(req.query)}`);
    global.logger.debug(`req-params: ${JSON.stringify(req.params)}`);
    // if (req.url !== '/user/login') {
    global.logger.debug(`req-body: ${JSON.stringify(req.body)}`);
    // }
    global.logger.debug(`sendOk: ${JSON.stringify(data)}`);
    res.status(200).send(rst);
  };
  res.sendErr = (err) => {
    global.logger.error(`error: [name:${err.name}][message:${err.message}][status:${err.status}]`);
    const errRes = resHandler.getErrorRes(err);
    global.logger.error(`traceId: ${req.headers.traceId}`);
    global.logger.error(`method: [${req.method}] req-url: ${req.url}`);
    global.logger.error(`req-query: ${JSON.stringify(req.query)}`);
    global.logger.error(`req-params: ${JSON.stringify(req.params)}`);
    global.logger.error(`req-body: ${JSON.stringify(req.body)}`);
    global.logger.error(`sendErr: ${JSON.stringify(errRes)}`); // no 'content' attribute
    res.status(errRes.status || 500).send(errRes);
  };
  next();
};

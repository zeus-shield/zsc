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
  }
  res.sendErr = (err) => {
  }
};
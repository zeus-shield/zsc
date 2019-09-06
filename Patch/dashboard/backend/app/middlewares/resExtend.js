'use strict';
const debug = require('debug')('backend:app:middlewares:resExtend');
const {resHandler} = require('../utils');

module.exports = (req, res, next) => {
  res.sendOk = (data) => {
  }
  res.sendErr = (err) => {
  }
};
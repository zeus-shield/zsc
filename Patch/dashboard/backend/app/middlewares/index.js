'use strict'
const middlewares = {};

middlewares.resExtend = require('./resExtend');
middlewares.verifyToken = require('./verifyToken');
middlewares.notFind = require('./notFind');
middlewares.log = require('./log');
module.exports = middlewares;
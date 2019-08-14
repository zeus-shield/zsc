'use strict'
const middlewares = {};

middlewares.resExtend = require('./resExtend');
middlewares.verifyToken = require('./verifyToken');
middlewares.notFind = require('./notFind');
module.exports = middlewares;
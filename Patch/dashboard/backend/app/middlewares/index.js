'use strict';

const middlewares = {};

middlewares.resExtend = require('./resExtend');
middlewares.verifyToken = require('./verifyToken');
middlewares.notFind = require('./notFind');
middlewares.log = require('./log');
middlewares.errorHandler = require('./errorHandler');

module.exports = middlewares;
'use strict';

const controllers = {};
controllers.user = require('./user');
controllers.company = require('./company');
controllers.insurance = require('./insurance');
module.exports = controllers;
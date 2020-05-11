'use strict';

const controllers = {};
controllers.user = require('./user');
controllers.company = require('./company');
controllers.insurance = require('./insurance');
controllers.qa = require('./qa');
module.exports = controllers;
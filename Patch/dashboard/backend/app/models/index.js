'use strict';

const mdbs = {};
mdbs.User = require('./user');
mdbs.Company = require('./company');
mdbs.Insurance = require('./insurance');
mdbs.QA = require('./qa');
mdbs.Press = require('./press');

module.exports = mdbs;
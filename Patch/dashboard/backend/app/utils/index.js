'use strict';

const utils = {};

utils.crypto = require('./crypto');
// utils.paramsHandler = require('./params-handler');
utils.resHandler = require('./responseHandler');
utils.format = require('./format');
utils.auth = require('./authentication');
// utils.validator = require('validator');
// utils.upload = require('./upload');
utils.nodemailer = require('./nodemailer');
utils.tool = require('./tool');
utils.TOTP = require('./totp');
utils.ecore = require('./ecore');

module.exports = utils;
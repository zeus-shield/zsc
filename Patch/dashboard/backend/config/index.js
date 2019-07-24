'use strict'
const config = require('config');

const settings = config.get('Customer.settings');
const log4js = config.get('Customer.log4js');

const configs = {};

configs.settings = require(`./${settings}`);

module.exports = configs;

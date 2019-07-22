'use strict'

const debug = require('debug')('backend:server');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const log4js = require('log4js');
const {settings, logConfig} = require('./config');

const app = express();
const routes = require('./app/routes');

const mongoose = require('mongoose');

/**
 * Normalize a port into a number, string, or false.
 */
function _normalizePort(val) {

}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;

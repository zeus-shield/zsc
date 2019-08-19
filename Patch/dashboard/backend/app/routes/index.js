'use strict'

const controllers = require('../controllers');
const middlewares = require('../middlewares');
const middlewaresArr = [middlewares.verifyToken, middlewares.log];
module.exports = (app) => {
};
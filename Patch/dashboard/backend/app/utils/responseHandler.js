'use strict'

// const {errorMsg, successMsg, errorSystem} = require('../../config')
const {errMsg} = require('../../config');

module.exports = {
  getErrorRes(err) {
    const result = errMsg[err.message] ? errMsg[err.message] : errMsg['SERVER_ERROR'];
    return result;
  };
}
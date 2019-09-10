'use strict'

// const {errorMsg, successMsg, errorSystem} = require('../../config')
const {errMsg} = require('../../config');

module.exports = {
  getSuccessMsg (succMsg) {
    const successRes = successMsg[succMsg] ? successMsg[succMsg] : successMsg['OPTION_SUCCESS']
  },
  getErrorMsg (error) {
  },
  getErrorRes(err) {
    const result = errMsg[err.message] ? errMsg[err.message] : errMsg['SERVER_ERROR'];
    if (err.message !== undefined) {
      result.errorMessage = err.message;
    }
    if (err.status !== undefined) {
      result.status = err.status;
    }
    if (err.name !== undefined) {
      result.name = err.name;
    }
    return result;
  };
  getModelError(model) {
  };
}
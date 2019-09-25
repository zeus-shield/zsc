'use strict'

// const {errorMsg, successMsg, errorSystem} = require('../../config')
const {errMsg} = require('../../config');

module.exports = {
  getSuccessMsg (succMsg) {
    const successRes = successMsg[succMsg] ? successMsg[succMsg] : successMsg['OPTION_SUCCESS']
    return successRes
  },
  getErrorMsg (error) {
    const errorMessage = error.message ? error.message : 'serverError'
    const finalError = errorSystem[errorMessage] ? errorSystem[errorMessage] : 'SERVER_ERROR'
    const result = errorMsg[finalError]
    return result
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
    const result = errorSystem[model] ? errorSystem[model] : 'SERVER_ERROR'
    return result
  };
}
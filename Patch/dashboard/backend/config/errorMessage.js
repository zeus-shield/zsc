'use strict'
module.exports = {
  SERVER_ERROR: {
    status: 500,
    errorCode: 10000,
    errorMessage: 'SERVER_ERROR'
  },
  'jwt expired': {
    status: 500,
    errorCode: 10001,
    errorMessage: 'jwt expired'
  },
  'jwt malformed': {
    status: 500,
    errorCode: 10002,
    errorMessage: 'jwt malformed'
  },
  'invalid signature': {
    status: 500,
    errorCode: 10003,
    errorMessage: 'invalid signature'
  }
  }
}

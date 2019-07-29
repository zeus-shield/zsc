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
  },
  'No recipients defined': {
    status: 500,
    errorCode: 10004,
    errorMessage: 'No recipients defined'
  },
  TOKEN_IS_MISSING: {
    status: 500,
    errorCode: 20000,
    errorMessage: 'TOKEN_IS_MISSING'
  },
  USER_HAS_EXIST: {
    status: 500,
    errorCode: 20100,
    errorMessage: 'USER_HAS_EXIST'
  },
  USER_NOT_EXIST: {
    status: 500,
    errorCode: 20101,
    errorMessage: 'USER_NOT_EXIST'
  },
  USER_PASSWORD_WRONG: {
    status: 500,
    errorCode: 20102,
    errorMessage: 'USER_PASSWORD_WRONG'
  }
  }
}

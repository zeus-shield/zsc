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
  USER_IS_ACTIVE: {
    status: 500,
    errorCode: 20102,
    errorMessage: 'USER_IS_ACTIVE'
  },
  USER_PASSWORD_WRONG: {
    status: 500,
    errorCode: 20103,
    errorMessage: 'USER_PASSWORD_WRONG'
  },
  USER_CODE_WRONG: {
    status: 500,
    errorCode: 20104,
    errorMessage: 'USER_CODE_WRONG'
  },
  USER_LOGIN_FAILED: {
    status: 500,
    errorCode: 20105,
    errorMessage: 'USER_LOGIN_FAILED'
  },
  USER_ADD_FAILED: {
    status: 500,
    errorCode: 20106,
    errorMessage: 'USER_ADD_FAILED'
  },
  USER_DELETE_FAILED: {
    status: 500,
    errorCode: 20107,
    errorMessage: 'USER_DELETE_FAILED'
  },
  USER_UPDATE_FAILED: {
    status: 500,
    errorCode: 20108,
    errorMessage: 'USER_UPDATE_FAILED'
  },
  USER_QUERY_FAILED: {
    status: 500,
    errorCode: 20109,
    errorMessage: 'USER_QUERY_FAILED'
  },
  USER_FIND_FAILED: {
    status: 500,
    errorCode: 20110,
    errorMessage: 'USER_FIND_FAILED'
  },
  USER_TOTP_NOT_SET: {
    status: 200,
    errorCode: 20111,
    errorMessage: 'USER_TOTP_NOT_SET'
  },
  USER_TOTP_SETTED: {
    status: 200,
    errorCode: 20112,
    errorMessage: 'USER_TOTP_SETTED'
  },
  USER_TOTP_VERIFY_ERR: {
    status: 200,
    errorCode: 20113,
    errorMessage: 'USER_TOTP_VERIFY_ERR'
  },
  ROUTE_NOT_EXIST: {
    status: 500,
    errorCode: 20201,
    errorMessage: 'ROUTE_NOT_EXIST'
  },
  }
}

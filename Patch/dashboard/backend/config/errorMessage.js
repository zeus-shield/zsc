'use strict';

/*
所有接口的status均为200；
errorCode规则：当errorCode为0时表示接口访问成功并且无抛错；不为零时，errorCode共计五位，
第一位表示错误级别，1开头的为系统级别错误，2开头为系统功能模块对应的错误，其中，第二三位
表示功能模块编号，第四五位表示具体错误编号。
*/
module.exports = {
  // 10000
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

  // 20000 + 000
  TOKEN_IS_MISSING: {
    status: 500,
    errorCode: 20000,
    errorMessage: 'TOKEN_IS_MISSING'
  },
  // TOKEN_IS_INVALID: {
  //   status: 500,
  //   errorCode: 20001,
  //   errorMsg: 'token invalid'
  // },
  // TOKEN_HAS_EXPIRED: {
  //   status: 500,
  //   errorCode: 20002,
  //   errorMsg: 'token expired'
  // },

  // 20000 + 100
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
  USER_IS_NOT_ACTIVE: {
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
    status: 500,
    errorCode: 20111,
    errorMessage: 'USER_TOTP_NOT_SET'
  },
  USER_TOTP_SETTED: {
    status: 500,
    errorCode: 20112,
    errorMessage: 'USER_TOTP_SETTED'
  },
  USER_TOTP_VERIFY_ERR: {
    status: 500,
    errorCode: 20113,
    errorMessage: 'USER_TOTP_VERIFY_ERR'
  },

  // 20000 + 200
  COMPANY_CATEGORIES_HAS_EXIST: {
    status: 500,
    errorCode: 20200,
    errorMessage: 'COMPANY_CATEGORIES_HAS_EXIST'
  },
  COMPANY_CATEGORIES_NOT_EXIST: {
    status: 500,
    errorCode: 20201,
    errorMessage: 'COMPANY_CATEGORIES_NOT_EXIST'
  },
  COMPANY_NOT_EXIST: {
    status: 500,
    errorCode: 20202,
    errorMessage: 'COMPANY_NOT_EXIST'
  },

  // 20000 + 300
  INSURANCE_HAS_EXIST: {
    status: 500,
    errorCode: 20300,
    errorMessage: 'INSURANCE_HAS_EXIST'
  },
  INSURANCE_NOT_EXIST: {
    status: 500,
    errorCode: 20301,
    errorMessage: 'INSURANCE_NOT_EXIST'
  },

  // 20000 + 900
  ROUTE_NOT_EXIST: {
    status: 500,
    errorCode: 20900,
    errorMessage: 'ROUTE_NOT_EXIST'
  },

  // 80000
  COMMON_PARAM_ERROR: {
    status: 500,
    errorCode: 80000,
    errorMessage: 'COMMON_PARAM_ERROR'
  },

  // 80000
  UNKNOWN: {
    status: 500,
    errorCode: 90000,
    errorMessage: 'UNKNOWN'
  }
};

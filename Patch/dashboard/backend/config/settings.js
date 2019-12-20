'use strict';

module.exports = {
  jwtExpires: 3600 * 24, //s
  port: process.env.PORT || 4000,
  website: '127.0.0.1:4000',
  dbConfig: {
  },
  mongooseDebug: true,
  stmpConfig: {
    host: 'smtp.163.com',
  },
  totpConfig: {
    issuer: 'Dashboard'
  },
  adminConfig: {
    name: 'admin',
    password: '123456',
    role: 'ordinary users'
  },
  qiniuConfig: {
  },
  upload: {
  }
}

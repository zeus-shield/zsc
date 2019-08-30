'use strict'

module.exports = {
  jwtExpires: 3600 * 24, //s
  port: process.env.PORT || 4000,
  website: '127.0.0.1:4000',
  mongooseDebug: true,
  stmpConfig: {
    host: 'smtp.163.com',
  },
  totpConfig: {
    issuer: 'Dashboard'
  },
  adminConfig: {
    role: 'ordinary users'
  },
  qiniuConfig: {
  },
  upload: {
  }
}

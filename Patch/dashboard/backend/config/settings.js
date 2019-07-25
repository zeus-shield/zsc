'use strict'

module.exports = {
  port: process.env.PORT || 4000,
  website: '127.0.0.1:4000',
  mongooseDebug: true,
  stmpConfig: {
    host: 'smtp.163.com',
  },
}

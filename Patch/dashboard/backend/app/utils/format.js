'use strict';

// const enums = require('../../config/enum');
const moment = require('moment');

module.exports = {
  formatDate(date) {
    let result;
    if (!date) {
      result = '';
    } else {
      result = moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  },
  user(data) {
    // if (data.sex) {
    //   data.reSex = enums.user[data.sex];
    // }
    delete data.password;
    delete data.emailCode;
    data.createdAt = this.formatDate(data.createdAt);
    data.updatedAt = this.formatDate(data.updatedAt);
    if (data.lastLoginAt) {
      data.lastLoginAt = this.formatDate(data.lastLoginAt);
    }
    if (data.activeDateExpiresAt) {
      data.activeDateExpiresAt = this.formatDate(data.activeDateExpiresAt);
    }
    return data;
  },
  company(data) {
    return data;
  }
};
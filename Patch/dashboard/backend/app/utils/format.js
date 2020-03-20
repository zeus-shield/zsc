'use strict';

// const enums = require('../../config/enum');
const moment = require('moment');
const crypto = require('./crypto');
const { settings } = require('../../config');

module.exports = {
  _formatDate(date) {
    let result;
    if (!date) {
      result = '';
    } else {
      result = moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  },
  user(data, auth = 'user') {
    // if (data.sex) {
    //   data.reSex = enums.user[data.sex];
    // }
    delete data.password;
    delete data.email_code;
    data.created_at = this._formatDate(data.created_at);
    data.updated_at = this._formatDate(data.updated_at);
    if (data.last_login_at) {
      data.last_login_at = this._formatDate(data.last_login_at);
    }
    if (data.active_expires_at) {
      data.active_expires_at = this._formatDate(data.active_expires_at);
    }
    return data;
  },
  userList(data, auth = 'user') {
    data.list.forEach((item, index) => {
      data.list[index] = this.user(item, auth);
    });
    return data;
  },
  company(data) {
    return data;
  }
};
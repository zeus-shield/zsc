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
  }
};
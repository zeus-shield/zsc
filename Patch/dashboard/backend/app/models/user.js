'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const {settings} = require('../../config');
UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.statics = {
};

module.exports = mongoose.model('User', UserSchema);

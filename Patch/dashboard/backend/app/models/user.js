'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const {settings} = require('../../config');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  account: { type: String, required: 'account is required!' },
}
);

UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.set('toObject', { getters: true, virtuals: true });
UserSchema.statics = {
};

module.exports = mongoose.model('User', UserSchema);

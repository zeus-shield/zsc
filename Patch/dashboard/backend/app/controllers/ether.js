'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');
const userAddPolicy = async(req, res) => {
};

const userCheckIn = async(req, res) => {
  debug('userCheckIn(%s)', req.body.account);
  try {
  } catch (err) {
  }
};

const rewardTransfer = async(req, res) => {
};

module.exports = { userAddPolicy, userCheckIn, rewardTransfer };

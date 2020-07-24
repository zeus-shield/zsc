'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

const debug = require('debug')('backend:app:controllers:ether');

const userAddPolicy = async(req, res) => {
};

const userCheckIn = async(req, res) => {
  debug('userCheckIn(%s)', req.body.account);
  try {
    // There is only one database write operation, and session can not be used.
    const hash = await services.dapp.dashboard.userCheckIn(JSON.parse(req.body.account));
    res.sendOk(hash);
  } catch (err) {
    res.sendErr(err);
  }
};

const rewardTransfer = async(req, res) => {
  // debug('rewardTransfer(%s, %s, %s)', req.body.from, req.body.to, req.body.value);
  try {
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { userAddPolicy, userCheckIn, rewardTransfer };

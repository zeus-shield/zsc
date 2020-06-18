'use strict';

const createError = require('http-errors');
const services = require('../services');
const { axios } = require('../utils');
// const debug = require('debug')('backend:app:apis:scan');

const balance = async(req, res) => {
  // debug('balance(%s)', JSON.stringify(req.query));
  try {
    const result = await services.scan.balance(req.query.eip, req.query.network, req.query.account);
    res.sendOk(result);
  } catch (err) {
    throw err;
  }
};

const token = async(req, res) => {
  // debug('token(%s)', JSON.stringify(req.query));
  try {
  } catch (err) {
    throw err;
  }
};

const tokens = async(req, res) => {
  // debug('tokens(%s)', JSON.stringify(req.query));
  try {
  } catch (err) {
    throw err;
  }
};

const rate = async(req, res) => {
  // debug('rate(%s)', JSON.stringify(req.query));
  try {
  } catch (err) {
    throw err;
  }
};

const rateFromAddr = async(req, res) => {
};

module.exports = { balance, token, tokens, rate, rateFromAddr };

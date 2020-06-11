'use strict';

const createError = require('http-errors');
const services = require('../services');
const { axios } = require('../utils');
// const debug = require('debug')('backend:app:apis:scan');

const balance = async(req, res) => {
  // debug('balance(%s)', JSON.stringify(req.query));
  try {
  } catch (err) {
    throw err;
  }
};

const token = async(req, res) => {
};

const tokens = async(req, res) => {
};

const rate = async(req, res) => {
};

const rateFromAddr = async(req, res) => {
};

module.exports = { balance, token, tokens, rate, rateFromAddr };

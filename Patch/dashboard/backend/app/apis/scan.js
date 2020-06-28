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
    let result;
    const conditions = {
      address: req.query.address,
      network: req.query.network
    };
    const token = await services.tokens.find(conditions, null, null);
    if (!token) {
      const info = await services.scan.token(req.query.eip, req.query.network, req.query.address, req.query.account);
      result = {
        balanceOf: info.balanceOf
      };
    } else {
    }
    res.sendOk(result);
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
  // debug('rateFromAddr(%s)', JSON.stringify(req.query));
  // https://api.kyber.network/sell_rate?id=0xdd974d5c2e2928dea5f71b9825b8b646686bd200&qty=1&id=0xdac17f958d2ee523a2206206994597c13d831ec7&qty=1
  try {
    let src;
    let dest;
    let rate;
    const instance = axios.create('https://api.kyber.network/', 5000);
  } catch (err) {
    throw err;
  }
};

module.exports = { balance, token, tokens, rate, rateFromAddr };

'use strict';

const createError = require('http-errors');
const services = require('../services');
const { axios } = require('../utils');
// const debug = require('debug')('backend:app:apis:scan');

const balance = async(req, res) => {
  // debug('balance(%s)', JSON.stringify(req.query));
  try {
    const result = await services.dapp.scan.balance(req.query.eip, req.query.network, req.query.account);
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
      const info = await services.dapp.scan.token(req.query.eip, req.query.network, req.query.address, req.query.account);
      result = {
        balanceOf: info.balanceOf
      };
    } else {
      const info = await services.dapp.scan.token(req.query.eip, req.query.network, req.query.address, req.query.account);
      result = {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        balanceOf: info.balanceOf
      };
    }
    res.sendOk(result);
  } catch (err) {
    throw err;
  }
};

const tokens = async(req, res) => {
  // debug('tokens(%s)', JSON.stringify(req.query));
  try {
    const params = {
      session: null,
      condition: {
        network: req.query.network
      }
    };
    const tokens = await services.tokens.list(params);
    if (tokens.dataCount === 0 || tokens.list.length === 0) {
      throw createError('TOKEN_NOT_EXIST');
    }

    let result = [];
    for (let i = 0; i < tokens.list.length; i++) {
      let token = {};
      token.name = tokens.list[i].name;
      token.symbol = tokens.list[i].symbol;
      token.decimals = tokens.list[i].decimals;
      const info = await services.dapp.scan.token(req.query.eip, req.query.network, tokens.list[i].address, req.query.account);
      token.balanceOf = info.balanceOf;
      result.push(token);
    }

    res.sendOk(result);
  } catch (err) {
    throw err;
  }
};

const rate = async(req, res) => {
  // debug('rate(%s)', JSON.stringify(req.query));
  try {
    let token = null;
    let srcAddr = null;
    let destAddr = null;
    let rate = 0;

    if (req.query.src.toUpperCase() !== 'ETH') {
      let conditions = {
        symbol: req.query.src.toUpperCase(),
        network: 'homestead'
      };
    } else {
    }

    res.sendOk({
      src: req.query.src.toUpperCase(),
      dest: req.query.dest.toUpperCase(),
      rate: rate
    });
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

    if (req.query.src) {
      const query = new URLSearchParams();
      query.append('id', req.query.src);
      query.append('qty', 1);
      if (req.query.dest) {
        query.append('id', req.query.dest);
        query.append('qty', 1);
      }
      const info = await axios.transaction(instance, 'get', 'sell_rate', null, query);
      if (info.error) {
        throw createError('TOKEN_NOT_SUPPORTED');
      }

      let conditions = {
        address: req.query.src,
        network: 'homestead'
      };
      let token = await services.tokens.find(conditions, null, null);
      if (token) {
        src = token.symbol;
      } else {
        src = req.query.src;
      }
    } else {
    }

    res.sendOk({src, dest, rate});
  } catch (err) {
    throw err;
  }
};

module.exports = { balance, token, tokens, rate, rateFromAddr };

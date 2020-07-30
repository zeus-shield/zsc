'use strict';

// const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:token');

const add = async(req, res) => {
  // debug('add(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    const conditions = {
      address: req.body.address,
      network: req.body.network
    };
    const result = await services.tokens.find(conditions, null, null);
    if (result) {
      throw createError('TOKEN_HAS_EXISTED');
    }

    const doc = {
      address: req.body.address,
      network: req.body.network,
      name: req.body.name,
      symbol: req.body.symbol,
      decimals: req.body.decimals,
      created_at: Date.now()
    };
    await services.tokens.insert([doc], null);

    res.sendOk('Add token successfully!');
  } catch (err) {
    throw err;
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.address) {
      conditions = {address: req.body.address};
    } else if (req.body.network) {
      conditions = {language: req.body.network};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.tokens.remove(conditions, false, null);
    if (!result) {
      throw createError('TOKEN_NOT_EXIST');
    }
  } catch (err) {
    throw err;
  }
};

const update = async(req, res) => {
  // debug('update(%s)', JSON.stringify(req.body));
  try {
    const conditions = {_id: req.body.id};
    const update = {
      address: req.body.address,
      network: req.body.network,
      name: req.body.name,
      symbol: req.body.symbol,
      decimals: req.body.decimals,
      updated_at: Date.now()
    };

    // Finds a matching document, updates it and return the modified document.
    const result = await services.tokens.update(conditions, update, false, null);
    if (!result) {
      throw createError('TOKEN_NOT_EXIST');
    }

    res.sendOk('update token successfully!');
  } catch (err) {
    throw err;
  }
};

const list = async(req, res) => {
  // debug("list()");
  try {
    const result = await services.tokens.list({session: null});
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const detail = async(req, res) => {
  // debug('detail(%s)', JSON.stringify(req.query));
  try {
    let conditions = {};

    if (req.query.id) {
      conditions = {_id: req.query.id};
    } else if (req.query.address) {
      conditions = {address: req.query.address};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.tokens.find(conditions, null, null);
    if (!result) {
      throw createError('TOKEN_NOT_EXIST');
    }
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const count = async(req, res) => {
  // debug('count(%s)', JSON.stringify(req.query));
  try {
    let conditions = {};

    if (req.query.id) {
      conditions = {_id: req.query.id};
    } else if (req.query.address) {
      conditions = {address: req.query.address};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.tokens.count(conditions);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { add, remove, update, list, detail, count };

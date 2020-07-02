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
  } catch (err) {
    throw err;
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
  } catch (err) {
    throw err;
  }
};

const update = async(req, res) => {
  // debug('update(%s)', JSON.stringify(req.body));
  try {
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
  } catch (err) {
    res.sendErr(err);
  }
};

const count = async(req, res) => {
};

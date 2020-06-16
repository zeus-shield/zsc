'use strict';

// const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:press');

const add = async(req, res) => {
  // debug('add(%s)', JSON.stringify(req.body));
  try {
  } catch (err) {
    throw err;
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  try {
  } catch (err) {
    throw err;
  }
};

const removeAll = async(req, res) => {
  // debug('removeAll(%s)', JSON.stringify(req.body));
  try {
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

const getAll = async(req, res) => {
  // debug("getAll()");
  try {
    const result = await services.presses.list({session: null});
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const get = async(req, res) => {
  // debug('get(%s)', JSON.stringify(req.query));
  try {
    let conditions = {};

    if (req.query.id) {
      conditions = {_id: req.query.id};
    } else if (req.query.language) {
      conditions = {language: req.query.language};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }
  } catch (err) {
    res.sendErr(err);
  }
};

const getByIndex = async(req, res) => {
  // debug('getByIndex(%s)', JSON.stringify(req.query));
  try {
    let conditions = {};

    if (req.query.id) {
      conditions = {_id: req.query.id};
    } else if (req.query.language) {
      conditions = {language: req.query.language};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }
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
    } else if (req.query.language) {
      conditions = {language: req.query.language};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.presses.count(conditions);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { add, remove, removeAll, update, getAll, get, getByIndex, count };

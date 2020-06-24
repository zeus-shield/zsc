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

    const result = await services.presses.find(conditions, null, null);
    if (!result) {
      throw createError('PRESS_DOC_NOT_EXIST');
    }
    res.sendOk(result);
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

    // method[1]
    const projection = {contents: {$slice: [parseInt(req.query.index, 10), 1]}};
    const result = await services.presses.find(conditions, projection, null);
    if (!result) {
      throw createError('PRESS_DOC_NOT_EXIST');
    }
    if (result.contents.length === 1) {
      result.contents[0].index = parseInt(req.query.index, 10);
    }

    // // method[2]
    // const result = await services.presses.getByIndex(conditions, req.query.index);
    // if (result.length === 0) {
    //   throw createError('PRESS_DOC_NOT_EXIST');
    // }
    // if (result.length === 1 && result[0].contents.length === 1) {
    //   result[0].contents[0].index = parseInt(req.query.index, 10);
    // }
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

'use strict';

// const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:qa');

const add = async(req, res) => {
  // debug('add(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    const conditions = {language: req.body.language};

    let content = JSON.parse(req.body.content);
    content.created_at = Date.now();
    const update = {
      $push: {contents: content},
      $set: {updated_at: Date.now()}
    };
    // Finds a matching document, updates it and return the modified document.
    const result = await services.qas.update(conditions, update, false, null);
    if (!result) {
      const doc = {
        language: req.body.language,
        contents: [content],
        created_at: Date.now()
      };
    }
    res.sendOk('Add qa successfully!');
  } catch (err) {
    throw err;
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    const conditions = {language: req.body.language};

    const update = {
      $pull: {contents: {_id: req.body.id}},
      $set: {updated_at: Date.now()}
    };
  } catch (err) {
    throw err;
  }
};

const removeAll = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  try {
  } catch (err) {
    throw err;
  }
};

const update = async(req, res) => {
  // debug('update(%s)', JSON.stringify(req.body));
  try {
    let content = JSON.parse(req.body.content);
    content.updated_at = Date.now();
    // There is only one database write operation, and session can not be used.
    const conditions = {
      language: req.body.language,
      'contents._id': req.body.id
    };

    const update = {
      'contents.$.question': content.question,
      'contents.$.answer': content.answer,
      'contents.$.updated_at': content.updated_at,
      updated_at: Date.now()
    };

    // Finds a matching document, updates it and return the modified document.
    const result = await services.qas.update(conditions, update, false, null);
    if (!result) {
      throw createError('QA_NOT_EXIST');
    }

    res.sendOk('update qa successfully!');
  } catch (err) {
    throw err;
  }
};

const getAll = async(req, res) => {
  // debug("list()");
  try {
    const result = await services.qas.list({session: null});
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const get = async(req, res) => {
  // debug('detail(%s)', JSON.stringify(req.query));
  try {
    let conditions = {};

    if (req.query.id) {
      conditions = {_id: req.query.id};
    } else if (req.query.language) {
      conditions = {language: req.query.language};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.qas.find(conditions, null, null);
    if (!result) {
      throw createError('QA_DOC_NOT_EXIST');
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
    const result = await services.qas.find(conditions, projection, null);
    if (!result) {
      throw createError('QA_DOC_NOT_EXIST');
    }
    if (result.contents.length === 1) {
      result.contents[0].index = parseInt(req.query.index, 10);
    }

    // // method[2]
    // const result = await services.qas.getByIndex(conditions, req.query.index);
    // if (result.length === 0) {
    //   throw createError('QA_DOC_NOT_EXIST');
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

    const result = await services.qas.count(conditions);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { add, remove, removeAll, update, getAll, get, getByIndex, count };

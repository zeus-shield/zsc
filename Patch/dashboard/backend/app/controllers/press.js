'use strict';

// const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:press');

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
    const result = await services.presses.update(conditions, update, false, null);
    if (!result) {
      const doc = {
        language: req.body.language,
        contents: [content],
        created_at: Date.now()
      };
      await services.presses.insert([doc], null);
    }
    res.sendOk('Add press successfully!');
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

    // Finds a matching document, updates it and return the modified document.
    const result = await services.presses.update(conditions, update, false, null);
    if (!result) {
      throw createError('PRESS_DOC_NOT_EXIST');
    }

    res.sendOk('Remove press successfully!');
  } catch (err) {
    throw err;
  }
};

const removeAll = async(req, res) => {
  // debug('removeAll(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.language) {
      conditions = {language: req.body.language};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.presses.remove(conditions, false, null);
    if (!result) {
      throw createError('PRESS_DOC_NOT_EXIST');
    }
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
      'contents.$.title': content.title,
      'contents.$.brief': content.brief,
      'contents.$.detail': content.detail,
      'contents.$.release_time': content.release_time,
      'contents.$.release_location': content.release_location,
      'contents.$.updated_at': content.updated_at,
      updated_at: Date.now()
    };

    // Finds a matching document, updates it and return the modified document.
    const result = await services.presses.update(conditions, update, false, null);
    if (!result) {
      throw createError('PRESS_NOT_EXIST');
    }

    res.sendOk('update press successfully!');
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

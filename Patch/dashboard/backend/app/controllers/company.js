'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:company');

const add = async(req, res) => {
  // debug('add(%s, %s)', req.body.name, req.body.categories);
  try {
    // There is only one database write operation, and session can not be used.
    // 1. check company name and code if exist ?
    let result = await services.companies.find({name: req.body.name}, null, null);
    if (result) {
      throw createError('COMPANY_HAS_EXISTED');
    }

    result = await services.companies.find({code: req.body.code}, null, null);
    if (result) {
      throw createError('COMPANY_CODE_HAS_EXISTED');
    }

    // 2. insert new company
    const doc = {
      name: req.body.name,
      code: req.body.code,
      categories: JSON.parse(req.body.categories),
      created_at: Date.now()
    };
    await services.companies.insert([doc], null);

    res.sendOk('Add new company successfully!');
  } catch (err) {
    res.sendErr(err);
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    let result = {};
    let conditions = {};

    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.name) {
      conditions = {name: req.body.name};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    result = await services.companies.find(conditions, null, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    // 1. remove insurance by insurance_id
    // can't remove in 'forEach'
    if (result.categories) {
      for (let i = 0; i < result.categories.length; i++) {
        for (let j = 0; j < result.categories[i].insurance_ids.length; j++) {
          // debug('[remove](%s)', result.categories[i].insurance_ids[j]);
          if (result.categories[i].insurance_ids[j] !== undefined &&
              result.categories[i].insurance_ids[j] !== null) {
            const resultInner = await services.insurances.remove({_id: result.categories[i].insurance_ids[j]}, false, session);
            if (!resultInner) {
              throw createError('INSURANCE_NOT_EXIST');
            }
          }
        }
      }
    }

    // 2. remove company
    result = await services.companies.remove(conditions, false, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    await session.commitTransaction();
    session.endSession();
    res.sendOk('Remove company successfully!');
  } catch (err) {
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};

const update = async(req, res) => {
  // debug('update(%s, %s)', req.body.id, req.body.update);
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    let result = {};
    const update = JSON.parse(req.body.update);

    // check duplicate
    for (let i = 0; i < update.categories.length - 1; i++) {
      for (let j = i + 1; j < update.categories.length; j++) {
        if (update.categories[i].name === update.categories[j].name) {
          throw createError('INSURANCE_CATEGORY_NAME_DUPLICATE');
        }

        if (update.categories[i].code === update.categories[j].code) {
          throw createError('INSURANCE_CATEGORY_CODE_DUPLICATE');
        }
      }
    }

    result = await services.companies.find({_id: req.body.id}, null, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    // debug(update.name);
    // for (let i=0; i<update.categories.length; i++) {
    //   debug(update.categories[i].name, update.categories[i]._id);
    // }
    // debug('--------------------------------------->')
    // debug(result.name);
    if (result.categories) {
      for (let i=0; i<result.categories.length; i++) {
        debug(result.categories[i].name, result.categories[i]._id);
      }
    }
    if (result.categories) {
      for (let i=0; i<result.categories.length; i++) {
        debug(result.categories[i].name, result.categories[i]._id);
      }
    }
    if (result.categories) {
      for (let i=0; i<result.categories.length; i++) {
        debug(result.categories[i].name, result.categories[i]._id);
      }
    }
    if (result.categories) {
      for (let i=0; i<result.categories.length; i++) {
        debug(result.categories[i].name, result.categories[i]._id);
      }
    }
    if (result.categories) {
      for (let i=0; i<result.categories.length; i++) {
        debug(result.categories[i].name, result.categories[i]._id);
      }
    }
    if (result.categories) {
      for (let i=0; i<result.categories.length; i++) {
        debug(result.categories[i].name, result.categories[i]._id);
      }
    }

    // 1. update and remove insurances according to updated data
    if (result.categories) {
    }

    // 2. update company including removing
    update.updated_at = Date.now();
    await services.companies.update({_id: req.body.id}, update, false, session);

    await session.commitTransaction();
    session.endSession();

    res.sendOk('Update company successfully!');
  } catch (err) {
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};

const list = async(req, res) => {
  // debug('list()');
  try {
    const params = {
      session: null,
      populate: {
        path: 'categories.insurance_ids',
        select: '_id brief.title',
        model: 'Insurance'
      }
    };
    const result = await services.companies.list(params);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const groupCategoriesByName = async(req, res) => {
  // debug('groupCategoriesByName()');
  try {
    const result = await services.companies.groupCategoriesByName();
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { add, remove, update, list, groupCategoriesByName };

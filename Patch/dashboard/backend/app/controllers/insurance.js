'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:insurance');

const add = async(req, res) => {
  // debug('add(%s, %s, %s, %s)', req.body.company, req.body.category, req.body.brief, req.body.detail);
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const company = req.body.company;
    const category = req.body.category;
    const brief = JSON.parse(req.body.brief);
    const detail = JSON.parse(req.body.detail);

    let result = null;
    let conditions = {};

    // 1. if company and category exist ?
    conditions = {
      name: company,
      'categories.name': category
    };
    result = await services.companies.find(conditions, null, session);
    if (!result) {
      throw createError('COMPANY_CATEGORIES_NOT_EXIST');
    }

    // 2. check insurance exist ?
    conditions = {
      company: company,
      category: category,
      'brief.title': brief.title
    };
    result = await services.insurances.find(conditions, null, session);
    if (result) {
      throw createError('INSURANCE_HAS_EXISTED');
    }

    // 3. add insurance
    brief.created_at = Date.now();
    const docs = [{
      company: company,
      category: category,
      brief: brief,
      detail: detail
    }];
    result = await services.insurances.insert(docs, session);

    // 4. push insurace id to company
    result = await services.companies.pushInsuranceId(company, category, result[0]._id, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    await session.commitTransaction();
    session.endSession();
    res.sendOk('Add new insurance successfully!');
  } catch (err) {
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    let conditions = {};
    let result = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.key) {
      const key = JSON.parse(req.body.key);
      conditions = {
        company: key.company,
        category: key.category,
        'brief.title': key.title
      };
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    // 1. remove and find insurance_id
    result = await services.insurances.remove(conditions, false, session);
    if (!result) {
      throw createError('INSURANCE_NOT_EXIST');
    }

    // 2. pop insurance id from company
    for (let i = 0; i < result.length; i++) {
      const resultInner = await services.companies.pullInsuranceId(result[i].company, result[i].category, result[i]._id, session);
      if (!resultInner) {
        throw createError('COMPANY_NOT_EXIST');
      }
    }

    await session.commitTransaction();
    session.endSession();
    res.sendOk('Remove insurance successfully!');
  } catch (err) {
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    throw err;
  }
};

const update = async(req, res) => {
  // debug('update(%s, %s)', req.body.id, req.body.update);
  try {
    // There is only one database write operation, and session can not be used.
    const conditions = {_id: req.body.id};
    const update = JSON.parse(req.body.update);
    update.brief.updated_at = Date.now();
    const result = await services.insurances.update(conditions, update, false, null);
    if (!result) {
      throw createError('INSURANCE_NOT_EXIST');
    }
    res.sendOk('Update insurance successfully!');
  } catch (err) {
    throw err;
  }
};

const list = async(req, res) => {
  // debug("list()");
  try {
    const result = await services.insurances.list({session: null});
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
    } else if (req.query.key) {
      const key = JSON.parse(req.query.key);
      conditions = {
        company: key.company,
        category: key.category,
        'brief.title': key.title
      };
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.insurances.find(conditions, null, null);
    if (!result) {
      throw createError('INSURANCE_NOT_EXIST');
    }
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const count = async(req, res) => {
  // debug('count(%s)', JSON.stringify(req.query));
  try {
    const key = JSON.parse(req.query.key);
    const company = key.company;
    const category = key.category;
    const title = key.title;
    let filter = {};
    if (!title) {
      filter = {
        company: company,
        category: category
      };
    } else {
      filter = {
        company: company,
        category: category,
        'brief.title': title
      };
    }
    const result = await services.insurances.countDocuments(filter);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { add, remove, update, list, detail, count };

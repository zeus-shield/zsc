'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:company');

const add = async(req, res) => {
  // debug('add(%s, %s)', req.body.name, req.body.categories);
  try {
    
  } catch (err) {
    res.sendErr(err);
  }
};

const remove = async(req, res) => {
};

const update = async(req, res) => {
  // debug('update(%s, %s)', req.body.id, req.body.update);
  let session = null;
  try {

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

'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

const debug = require('debug')('backend:app:controllers:insurance');

const add = async (req, res) => {
  // debug("add(%s, %s, %s, %s)", req.body.company, req.body.category,
  //   JSON.parse(req.body.brief), JSON.parse(req.body.detail));
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const company = req.body.company;
    const category = req.body.category;
    const brief = JSON.parse(req.body.brief);
    const detail = JSON.parse(req.body.detail);
  } catch (err) {
  }
};

const remove = async (req, res) => {
  // debug("remove(%s, %s, %s)", req.body.company, req.body.category, req.body.title);
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (err) {
  }
};

const update = async (req, res) => {
  // debug("update(%s, %s, %s, %s)", req.body.company, req.body.category, req.body.title, req.body.update);
  try {
    const company = req.body.company;
    const category = req.body.category;
    const title = req.body.title;
    const update = JSON.parse(req.body.update);

    const result = await services.insurances.update(company, category, title, update, null);
    if(!result) {
      throw createError('INSURANCE_NOT_EXIST');
    }    

    res.sendOk('Update insurance successfully!');
  } catch (err) {
    // debug(err);
    throw err;
  }
};

const list = async (req, res) => {
  // debug("list()");
  try {
    const result = await services.insurances.findAll(null);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const detail = async (req, res) => {
  // debug("detail(%s)", req.query.company, req.query.category, req.query.title);
  try {
    const method = req.query.method;
    const company = req.query.company;
    const category = req.query.category;
    const title = req.query.title;
    const id = req.query.id;

    let result;

    if(method === 'key') {
      result = await services.insurances.find(company, category, title, null);
    } else if(method === 'id') {
      result = await services.insurances.findById(id, null);
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    if(!result) {
      throw createError('INSURANCE_NOT_EXIST');
    }
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const count = async (req, res) => {
  // debug("count(%s, %s, %s)", req.query.company, req.query.category, req.query.title);
  try {
    const company = req.query.company;
    const category = req.query.category;
    const title = req.query.title;

    const result = await services.insurances.count(company, category, title);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = {add, remove, update, list, detail, count};

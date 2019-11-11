'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

const debug = require('debug')('backend:app:controllers:company');
const add = async (req, res) => {
};

const remove = async (req, res) => {
};

const removeCategory = async (req, res) => {
  debug("removeCategory(%s, %s)", req.body.name, req.body.category);

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (err) {
  }
};

const update = async (req, res) => {
  const name = req.body.name;
  const newName = req.body.newName;
  const newCategoryNames = JSON.parse(req.body.newCategoryNames);

  debug("update(%s, %s, %s)", name, newName, newCategoryNames);

  let session = null;
  try {
    let categories = [];
    let result;
    let ret;

    session = await mongoose.startSession();
    session.startTransaction();

    // 1. update company name and category name for 'insurances'
    result = await services.companies.findByName(name, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    for(let i=0; i<newCategoryNames.length; i++) {
    }
  } catch (err) {
    debug(err);
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};

const list = async (req, res) => {
  debug("list()");
  try {
    const result = await services.companies.findAll(null);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const detail = async (req, res) => {
  debug("detail(%s)", req.query.name);
  try {
    const result = await services.companies.findByName(req.query.name, null);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }
    
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const groupCategoriesByName = async (req, res) => {
  debug("groupCategoriesByName()");
  try {
    const result = await services.companies.groupCategoriesByName(null);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = {add, remove, removeCategory, update, list, detail, groupCategoriesByName};

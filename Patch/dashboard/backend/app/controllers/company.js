'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

// const debug = require('debug')('backend:app:controllers:company');

const add = async(req, res) => {
  // debug('add(%s, %s)', req.body.name, req.body.categories);
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const name = req.body.name;
    const categories = JSON.parse(req.body.categories);
    const createdAt = Date.now();

    // object/array deep copy
    // const newCategories = JSON.parse(JSON.stringify(categories));
    const newCategories = [];

    for (let i = 0; i < categories.length; i++) {
      const result = await services.companies.findByNamesAndCategory(name, categories[i].name, session);
      if (!result) {
        newCategories.push(categories[i]);
      }
    }

    if (categories.length !== 0 && newCategories.length === 0) {
      throw createError('COMPANY_CATEGORIES_HAS_EXIST');
    }

    const update = {$push: {categories: newCategories}};
    const result = await services.companies.update(name, update, session);
    if (!result) {
      await services.companies.insert(name, newCategories, createdAt, session);
    }

    await session.commitTransaction();
    session.endSession();
    res.sendOk('Add new company successfully!');

  } catch (err) {
    res.sendErr(err);
  }
};

const remove = async(req, res) => {
  debug('remove(%s)', req.body.name);

  let session = null;
  try {
    let result;
    let insuranceIds = [];

    session = await mongoose.startSession();
    session.startTransaction();

    // 1. collect 'insurance_id' from 'company'
    result = await services.companies.findByName(req.body.name, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    result.categories.forEach(category => {
      if (category.insurance_ids !== undefined && category.insurance_ids !== null) {
        category.insurance_ids.forEach(id => {
          insuranceIds.push(id);
        });
      }
    });

    if (insuranceIds.length > 0) {
      // 2. remove insurance
      // insuranceIds.forEach(async id => {
      //   result = await services.insurances.deleteById(id, null);
      //   debug(result);
      // });
      for (let i = 0; i < insuranceIds.length; i++) {
        await services.insurances.deleteById(insuranceIds[i], session);
        // debug(result);
      }
    }

    // 3. remove company
    result = await services.companies.delete(req.body.name, session);
    // debug(result);

    await session.commitTransaction();
    session.endSession();
    res.sendOk('Remove company successfully!');
  } catch (err) {
    // debug(err);
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};


const update = async(req, res) => {
  const name = req.body.name;
  const newName = req.body.newName;
  const newCategoryNames = JSON.parse(req.body.newCategoryNames);

  debug('update(%s, %s, %s)', name, newName, req.body.newCategoryNames);

  let session = null;
  try {
    let categories = [];
    let result;

    session = await mongoose.startSession();
    session.startTransaction();

    // 1. update company name and category name for 'insurances'
    result = await services.companies.findByName(name, session);
    if (!result) {
      throw createError('COMPANY_NOT_EXIST');
    }

    for (let i = 0; i < newCategoryNames.length; i++) {
      if (result.categories[i] !== undefined && result.categories[i] !== null) {
        const categoryName = result.categories[i].name;
        const newCategoryName = newCategoryNames[i];
        const update = {
          company: newName,
          category: newCategoryName
        };
        await services.insurances.updateByCompanyAndCategory(name, categoryName, update, true, session);
        // debug(ret);

        let category = result.categories[i];
        category.name = newCategoryName;
        categories.push(category);
      }
    }

    // 2. update company name and category name for 'companies'
    const update = {
      name: newName,
      categories: categories
    };
    await services.companies.update(name, update, session);
    // debug(ret);

    await session.commitTransaction();
    session.endSession();

    res.sendOk('Update company successfully!');

  } catch (err) {
    debug(err);
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

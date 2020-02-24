'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

const debug = require('debug')('backend:app:controllers:company');

// support:
// 1. Add new company and new categories.
// 2. Add new categories when company exist.
const add = async(req, res) => {
  debug('add(%s, %s)', req.body.name, req.body.categories);
  let session = null;
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

    if (newCategories.length === 0) {
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
    // debug(err);
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
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

const removeCategory = async(req, res) => {
  debug('removeCategory(%s, %s)', req.body.name, req.body.category);

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    let result = await services.companies.findByNamesAndCategory(req.body.name, req.body.category, session);
    if (!result) {
      throw createError('COMPANY_CATEGORIES_NOT_EXIST');
    }

    // 1. remove insurances from insurance
    const category = result.categories.find(category => {
      return category.name === req.body.category;
    });
    if (category !== undefined) {
      if (category.insurance_ids.length > 0) {
        // remove
        for (let i = 0; i < category.insurance_ids.length; i++) {
          await services.insurances.deleteById(category.insurance_ids[i], session);
          // debug(result);
        }
      }
    }

    // 2. pull category from company
    const update = {$pull: {'categories': {name: req.body.category}}};
    result = await services.companies.update(req.body.name, update, session);

    await session.commitTransaction();
    session.endSession();

    res.sendOk('Remove companie category successfully!');
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
    let ret;

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
        ret = await services.insurances.updateByCompanyAndCategory(name, categoryName, update, true, session);
        debug(ret);

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
    ret = await services.companies.update(name, update, session);
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
  debug('list()');
  try {
    const result = await services.companies.findAll(null);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const detail = async(req, res) => {
  debug('detail(%s)', req.query.name);
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

const groupCategoriesByName = async(req, res) => {
  debug('groupCategoriesByName()');
  try {
    const result = await services.companies.groupCategoriesByName(null);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

module.exports = { add, remove, removeCategory, update, list, detail, groupCategoriesByName };

'use strict';
const add = async (req, res) => {
};

const remove = async (req, res) => {
};

const removeCategory = async (req, res) => {
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
  } catch (err) {
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

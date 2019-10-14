'use strict';
const add = async (req, res) => {
};

const remove = async (req, res) => {
};

const removeCategory = async (req, res) => {
};

const update = async (req, res) => {
};

const list = async (req, res) => {
};

const detail = async (req, res) => {
};

const groupCategoriesByName = async (req, res) => {
  try {
    const result = await services.companies.groupCategoriesByName(null);
    res.sendOk(result);
  } catch (err) {
  }
};

module.exports = {add, remove, removeCategory, update, list, detail, groupCategoriesByName};

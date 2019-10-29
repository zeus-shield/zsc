'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const services = require('../services');

const debug = require('debug')('backend:app:controllers:insurance');

const add = async (req, res) => {
};

const remove = async (req, res) => {
};

const update = async (req, res) => {
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

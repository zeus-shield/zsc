'use strict';

const services = require('../services');
const {auth} = require('../utils');
const {settings} = require('../../config');

const debug = require('debug')('backend:app:controllers:user');

const emailCode = async (req, res) => {
  try {
  } catch (err) {
  }
};

const signUp = async (req, res) => {
  try {
  } catch (err) {
    res.sendErr(err);
  }
};

const login = async (req, res) => {
  try {
  } catch (err) {
    res.sendErr(err);
  }
};

const detail = async (req, res) => {
  debug("detail(%s, %s)", req.headers._id);
  try {
    const result = await services.users.detail(req.headers._id);
    res.sendOk(result);
  } catch(err) {
    res.sendErr(err);
  }
};

const setTOTP = async (req, res) => {
  debug("setTOTP(%s, %s)", req.headers._id, req.headers.cmd);
  try {
    const result = await services.users.setTOTP(req.headers._id, req.headers.cmd);
    res.sendOk(result);
  } catch(err) {
    res.sendErr(err);
  }
};

const saveTOTP = async (req, res) => {
  debug("saveTOTP(%s, %s, %s)", req.headers._id, req.headers.code, req.headers.key);
  try {
    const result = await services.users.saveTOTP(req.headers._id, req.headers.code, req.headers.key);
    res.sendOk(result);
  } catch(err) {
    res.sendErr(err);
  }
};

const updateTOTP = async (req, res) => {
  debug("updateTOTP(%s, %s)", req.headers._id, req.headers.code);
  try {
    const result = await services.users.updateTOTP(req.headers._id, req.headers.code, req.body);
    res.sendOk(result);
  } catch(err) {
    res.sendErr(err);
  }
};

const list = async (req, res) => {
  debug("list()");
  res.send('/users/list');
};
// const create = async (req, res) => {
//   debug("create()");
//   try {
//     const result = await services.users.addUser(req.body);
//     res.sendOk(result);
//   } catch (err) {
//     res.sendErr(err);
//   }
// };

module.exports = {emailCode, signUp, login, detail, setTOTP, saveTOTP, updateTOTP, list};
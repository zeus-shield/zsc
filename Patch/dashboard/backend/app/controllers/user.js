'use strict';

const services = require('../services');
const {auth} = require('../utils');
const {settings} = require('../../config');

const debug = require('debug')('backend:app:controllers:users');

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
};
const setTOTP = async (req, res) => {
};

const saveTOTP = async (req, res) => {
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
module.exports = {emailCode, signUp, login, detail, setTOTP, saveTOTP, updateTOTP, list};
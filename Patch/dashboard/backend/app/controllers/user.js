'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const moment = require('moment');
const services = require('../services');
const { crypto, format, auth, nodemailer, tool, TOTP } = require('../utils');
const { settings } = require('../../config');

// const debug = require('debug')('backend:app:controllers:user');

const emailCode = async(req, res) => {
  // debug('emailCode(%s)', req.body.account);
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const account = req.body.account;

    // check user exist ?
    let result = await services.users.find({account: account}, null, session);
    if (result) {
      if (result.is_active) {
        throw createError('USER_IS_ACTIVE');
      }
    }
    }
  } catch (err) {
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};

const signUp = async(req, res) => {
  // debug('signUp(%s, %s, %s)', req.body.account, req.body.password, req.body.code);
  try {
    const result = await services.users.signUp(req.body.account, req.body.password, req.body.code);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const login = async(req, res) => {
  debug('login(%s, %s, %s)', req.body.account, req.body.password, req.body.code);
  try {
    const result = await services.users.login(req.body.account, req.body.password, req.body.code);
    result.token = auth.createToken(result._id);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};



const setTOTP = async(req, res) => {
  debug('setTOTP(%s, %s)', req.headers._id, req.headers.cmd);
  try {
    const result = await services.users.setTOTP(req.headers._id, req.headers.cmd);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const saveTOTP = async(req, res) => {
  // debug('saveTOTP(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.account) {
      conditions = {account: req.body.account};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }
    const code = req.body.code;
    const key = req.body.key;

  } catch (err) {
    res.sendErr(err);
  }
};

const updateTOTP = async(req, res) => {
  // debug('updateTOTP(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.account) {
      conditions = {account: req.body.account};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }
    const code = req.body.code;
    const on = req.body.on;

    // check user exist ?
    let result = await services.users.find(conditions, null, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    // check google auth has setted ?
    if (result.totp_key === undefined || result.totp_on === undefined) {
      throw createError('USER_TOTP_NOT_SET');
    }

    const handle = new TOTP(result.totp_key);

    // verify google code
    const verify = await handle.verify(code);
    if (!verify) {
      throw createError('USER_TOTP_VERIFY_ERR');
    }

    const update = {
      totp_on: on,
      updated_at: Date.now()
    };
    // Finds a matching document, updates it and return the modified document.
    result = await services.users.update(conditions, update, false, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    // res.sendOk(format.user(result));
    res.sendOk('Update TOTP successfully!');
  } catch (err) {
    res.sendErr(err);
  }
};

const addPolicy = async(req, res) => {
  // debug('addPolicy(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.account) {
      conditions = {account: req.body.account};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    // There is only one database write operation, and session can not be used.
    let policy = JSON.parse(req.body.policy);
    if (policy && policy.insurance && policy.insurance.id) {
      policy.insurance.id = mongoose.Types.ObjectId(policy.insurance.id);
    }

    const update = {
      $push: {policies: policy},
      $set: {updated_at: Date.now()}
    };
    // Finds a matching document, updates it and return the modified document.
    const result = await services.users.update(conditions, update, false, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    res.sendOk('Add policy successfully!');
  } catch (err) {
    throw err;
  }
};

const list = async(req, res) => {
  // debug('list()');
  try {
    const result = await services.users.list({session: null});
    res.sendOk(format.userList(result, 'admin'));
    // res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const detail = async(req, res) => {
  // debug('detail(%s)', JSON.stringify(req.query));
  try {
    let conditions = {};
    if (req.query.id) {
      conditions = {_id: req.query.id};
    } else if (req.query.account) {
      conditions = {account: req.query.account};
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const result = await services.users.find(conditions, null, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }
    res.sendOk(format.user(result));
  } catch (err) {
    res.sendErr(err);
  }
};

const statistics = async(req, res) => {
  // debug('statistics(%s, %s, %s, %s, %s)', req.query.company,
  //   req.query.category, req.query.title, req.query.sort, req.query.limit);
  try {
    const company = req.query.company;
    const category = req.query.category;
    const title = req.query.title;
    const sort = parseInt(req.query.sort, 10);
    const limit = parseInt(req.query.limit, 10);

    const result = await services.users.statistics(company, category, title, sort, limit);
    res.sendOk(result);
  } catch (err) {
    throw err;
  }
};

module.exports = { emailCode, signUp, login, remove, update, setTOTP, saveTOTP, updateTOTP, addPolicy, list, detail, statistics };

// // import user from './user'
// export default {
//   login: async (req, res) => {
//     debug("login()");
//   },
//   list: async (req, res) => {
//     debug("list()");
//   },
//   detail: async (req, res) => {
//     debug("detail(%s)", req.params._id);
//   }
// }


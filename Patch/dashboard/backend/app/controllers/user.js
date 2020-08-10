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
    const accountCrypto = req.body.accountCrypto;

    // check user exist ?
    let result = await services.users.find({account: account}, null, session);
    if (result) {
      if (result.is_active) {
        throw createError('USER_IS_ACTIVE');
      }
    }

    // send email
    const code = tool.random(6);
    const config = {
      from: settings.stmpConfig.user, // from
      to: account, // to
      subject: settings.stmpConfig.subject, // subject
      text: settings.stmpConfig.text + code// text
    };
    await nodemailer(config);

    const update = {
      email_code: crypto.encrypted(code, settings.saltKey),
      updated_at: Date.now(),
      active_expires_at: Date.now() + settings.stmpConfig.timeout
    };
    // Finds a matching document, updates it and return the modified document.
    result = await services.users.update({account: account}, update, false, session);
    if (!result) {
      const doc = {
        cmd: 'email',
        account: account,
        account_crypto: accountCrypto,
        email_code: crypto.encrypted(code, settings.saltKey),
        created_at: Date.now(),
        updated_at: Date.now(),
        active_expires_at: Date.now() + settings.stmpConfig.timeout
      };
      result = await services.users.insert([doc], session);

      await session.commitTransaction();
      session.endSession();

      res.sendOk(format.user(result[0]));
    } else {
      await session.commitTransaction();
      session.endSession();

      res.sendOk(format.user(result));
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
  // debug('signUp(%s, %s, %s, %s, %s)', req.body.cmd, req.body.account, req.body.accountCrypto, req.body.password, req.body.code);
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const cmd = req.body.cmd;
    const account = req.body.account;
    const accountCrypto = req.body.accountCrypto;
    const password = req.body.password;
    const code = req.body.code;

    let result;
    if (cmd === 'email') {
      // check user exist ?
      result = await services.users.find({account: account}, null, session);
      if (!result) {
        throw createError('USER_NOT_EXIST');
      } else {
        if (result.is_active) {
          throw createError('USER_IS_ACTIVE');
        }
      }

      // check code ?
      const inputCode = crypto.encrypted(code, settings.saltKey);
      const equal = await crypto.check(inputCode, result.email_code);
      if (!equal) {
        throw createError('USER_CODE_WRONG');
      }

      // check timeout
      const now = Date.now();
      const expires = moment(result.active_expires_at).valueOf();
      if (now - expires >= 0) {
        throw createError('USER_CODE_TIMEOUT');
      }

      // update cmd/password/is_active/updated_at
      const update = {
      };
    } else if (cmd === 'quick') {
    } else {
      throw createError('USER_SIGNUP_CMD_ERR');
    }

    await session.commitTransaction();
    session.endSession();
    res.sendOk('Sign up successfully!');
  } catch (err) {
    if (session !== null) {
      await session.abortTransaction();
      session.endSession();
    }
    res.sendErr(err);
  }
};

const login = async(req, res) => {
  // debug('login(%s, %s, %s)', req.body.account, req.body.password, req.body.code);
  try {
    // There is only one database write operation, and session can not be used.
    const account = req.body.account;
    const password = req.body.password;
    const code = req.body.code;
    const result = await services.users.login(req.body.account, req.body.password, req.body.code);
    result.token = auth.createToken(result._id);
    res.sendOk(result);
  } catch (err) {
    res.sendErr(err);
  }
};

const remove = async(req, res) => {
  // debug('remove(%s)', JSON.stringify(req.body));
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

    const result = await services.users.remove(conditions, false, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    res.sendOk('Remove user successfully!');
  } catch (err) {
    throw err;
  }
};

const update = async(req, res) => {
  // debug('update(%s, %s)', req.body.id, req.body.update);
  try {
    // There is only one database write operation, and session can not be used.
    let result = {};
    let update = JSON.parse(req.body.update);

    // check account is exist excluding self ?
    if (update.account) {
      result = await services.users.find({account: update.account}, null, null);
      if (result) {
        // check id is exist
        const _result = await services.users.find({_id: req.body.id}, null, null);
        if (_result) {
          if (_result.account !== update.account) {
            throw createError('USER_HAS_EXISTED');
          }
        } else {
          throw createError('USER_NOT_EXIST');
        }
      }
    }

    if (update.password) {
      update.password = crypto.encrypted(update.password, settings.saltKey);
    }
    update.updated_at = Date.now();

    // Finds a matching document, updates it and return the modified document.
    result = await services.users.update({_id: req.body.id}, update, false, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }
    res.sendOk('update user successfully!');
  } catch (err) {
    throw err;
  }
};

const setTOTP = async(req, res) => {
  // debug('setTOTP(%s)', JSON.stringify(req.body));
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
    const cmd = req.body.cmd;

    // check user exist ?
    const result = await services.users.find(conditions, null, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    if (cmd === 'set') {
      if (result.totp_key !== undefined) {
        throw createError('USER_TOTP_SETTED');
      }
    } else if (cmd === 'reset') {
      if (result.totp_key === undefined) {
        throw createError('USER_TOTP_NOT_SET');
      }
    } else {
      throw createError('UNKNOWN');
    }

    const key = TOTP.randomKey();
    const handle = new TOTP(key);
    result.QRUrl = handle.gaURL(result.account, settings.totpConfig.issuer);
    result.totp_key = key;

    res.sendOk(format.user(result));
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

    // check user exist ?
    let result = await services.users.find(conditions, null, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    // check google auth has setted ?
    // if (result.totp_key === undefined) {
    //   throw createError('USER_TOTP_NOT_SET');
    // }

    const handle = new TOTP(key);

    // verify google code
    const verify = await handle.verify(code);
    if (!verify) {
      throw createError('USER_TOTP_VERIFY_ERR');
    }

    // keep original 'totp_on'
    let on = false;
    if (result.totp_on !== undefined) {
      on = result.totp_on;
    } else {
      on = true;
    }

    // update totp_key/totp_on/updated_at
    const now = Date.now();
    const update = {
      totp_key: key,
      totp_on: on,
      updated_at: now
    };
    // Finds a matching document, updates it and return the modified document.
    result = await services.users.update(conditions, update, false, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }
    // result.QRUrl = handle.gaURL(result.account, settings.totpConfig.issuer);
    // res.sendOk(format.user(result));

    res.sendOk('Save TOTP successfully!');
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

const removeAllPolicies = async(req, res) => {
  // debug('removeAllPolicies(%s)', JSON.stringify(req.body));
  try {
    // There is only one database write operation, and session can not be used.
    let conditions = {};
    if (req.body.id) {
      conditions = {_id: req.body.id};
    } else if (req.body.account) {
      const account = JSON.parse(req.body.account);
      if (account.raw) {
        conditions = {account: account.raw};
      } else if (account.crypto) {
        conditions = {account_crypto: account.crypto};
      } else {
        throw createError('COMMON_PARAM_ERROR');
      }
    } else {
      throw createError('COMMON_PARAM_ERROR');
    }

    const update = {
      $pull: {policies: {}},
      $set: {updated_at: Date.now()}
    };
    // Finds a matching document, updates it and return the modified document.
    const result = await services.users.update(conditions, update, false, null);
    if (!result) {
      throw createError('USER_NOT_EXIST');
    }

    res.sendOk('Remove all policies successfully!');
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
      const account = JSON.parse(req.query.account);
      if (account.raw) {
        conditions = {account: account.raw};
      } else if (account.crypto) {
        conditions = {account_crypto: account.crypto};
      } else {
        throw createError('COMMON_PARAM_ERROR');
      }
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

module.exports = { emailCode, signUp, login, remove, update, setTOTP, saveTOTP, updateTOTP, addPolicy, removeAllPolicies, list, detail, statistics };

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


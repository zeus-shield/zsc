'use strict';

import CryptoJS from 'crypto-js';
import Transaction from './transaction.js';

class User extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async buildEmailCode(account) {
    const data = new URLSearchParams();
    data.append('account', account);

    try {
      return await this.transaction('post', 'user/emailCode', null, null, data);
    } catch (err) {
      throw err;
    }
  };

  async signUp(account, code, password) {
    const data = new URLSearchParams();
    data.append('account', account);
    data.append('accountCrypto', '0x' + CryptoJS.MD5(account).toString());
    data.append('password', password);
    data.append('code', code);

    try {
      return await this.transaction('post', 'user/signUp', null, null, data);
    } catch (err) {
      throw err;
    }
  };

  async login(account, password, code) {
    const data = new URLSearchParams();
    data.append('account', account);
    data.append('password', password);
    data.append('code', code);

    try {
      return await this.transaction('post', 'user/login', null, null, data);
    } catch (err) {
      throw err;
    }
  };

  // only by id
  async update(token, id, update) {
    const data = new URLSearchParams();
    data.append('id', id);
    data.append('update', JSON.stringify(update));

    try {
      return await this.transaction('post', 'user/update', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async remove(token, id, account) {
    const data = new URLSearchParams();
    if (id) {
      data.append('id', id);
    } else if (account) {
      data.append('account', account);
    } else {}

    try {
      return await this.transaction('post', 'user/remove', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async setTOTP(token, id, account, cmd) {
    const data = new URLSearchParams();
    if (id) {
      data.append('id', id);
    } else if (account) {
      data.append('account', account);
    } else {}
    data.append('cmd', cmd);

    try {
      return await this.transaction('post', 'user/setTOTP', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async saveTOTP(token, id, account, code, key) {
    const data = new URLSearchParams();
    if (id) {
      data.append('id', id);
    } else if (account) {
      data.append('account', account);
    } else {}
    data.append('code', code);
    data.append('key', key);

    try {
      return await this.transaction('post', 'user/saveTOTP', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async setTOTPOn(token, id, account, code, on) {
    const data = new URLSearchParams();
    if (id) {
      data.append('id', id);
    } else if (account) {
      data.append('account', account);
    } else {}
    data.append('code', code);
    data.append('on', on);

    try {
      return await this.transaction('post', 'user/updateTOTP', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async addPolicy(token, id, account, policy) {
    const data = new URLSearchParams();
    if (id) {
      data.append('id', id);
    } else if (account) {
      data.append('account', account);
    } else {}
    data.append('policy', JSON.stringify(policy));

    try {
      return await this.transaction('post', 'user/addPolicy', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async removeAllPolicies(token, id, account) {
    const data = new URLSearchParams();
    if (id) {
      data.append('id', id);
    } else if (account) {
      data.append('account', account);
    } else {}

    try {
      return await this.transaction('post', 'user/removeAllPolicies', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async info(token, id, account) {
    const query = new URLSearchParams();
    if (id) {
      query.append('id', id);
    } else if (account) {
      query.append('account', JSON.stringify(account));
    } else {}

    try {
      return await this.transaction('get', 'user/detail', { token }, query);
    } catch (err) {
      throw err;
    }
  };

  async list(token) {
    try {
      return await this.transaction('get', 'user', { token });
    } catch (err) {
      throw err;
    }
  };

  async statistics(token, company, category, title, sort, limit) {
    const query = new URLSearchParams();
    query.append('company', company);
    query.append('category', category);
    query.append('title', title);
    query.append('sort', sort);
    query.append('limit', limit);

    try {
      return await this.transaction('get', 'statistics', { token }, query);
    } catch (err) {
      throw err;
    }
  };
}

export default User;

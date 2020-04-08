'use strict';

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

  };

  async setTOTPOn(token, id, account, code, on) {
  };

  async addPolicy(token, id, account, policy) {
  };

  async info(token, id, account) {
  };

  async list(token) {
    try {
      return await this.transaction('get', 'user', {token});
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
      return await this.transaction('get', 'statistics', {token}, query);
    } catch (err) {
      throw err;
    }
  };
}

export default User;

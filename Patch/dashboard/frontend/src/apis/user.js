'use strict';

import Transaction from './transaction.js';

class User extends Transaction {
  constructor(instance) {
    super(instance);
  };





  async setTOTPOn(token, id, account, code, on) {
  };

  async addPolicy(token, id, account, policy) {
  };

  async info(token, id, account) {
  };

  async list(token) {
    try {
    } catch (err) {
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

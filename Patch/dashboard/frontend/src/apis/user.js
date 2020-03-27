'use strict';

import Transaction from './transaction.js';

class User extends Transaction {
  constructor(instance) {
    super(instance);
  };



  async info(token, id, account) {
  };

  async list(token) {
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

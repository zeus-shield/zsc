'use strict';

import Transaction from './transaction.js';

class Company extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, name, categories) {
    const data = new URLSearchParams();
    data.append('name', name);
    // categories is array
    data.append('categories', JSON.stringify(categories));

  };

  async remove(token, id, name) {
  };

  // only by id
  async update(token, id, update) {
    const data = new URLSearchParams();
    data.append('id', id);
    data.append('update', JSON.stringify(update));
  };

  async list(token) {
    try {
      return await this.transaction('get', 'company', {token});
    } catch (err) {
      throw err;
    }
  };

  async groupCategoriesByName(token) {
    try {
      return await this.transaction('get', 'company/groupCategoriesByName', {token});
    } catch (err) {
      throw err;
    }
  };
}

export default Company;

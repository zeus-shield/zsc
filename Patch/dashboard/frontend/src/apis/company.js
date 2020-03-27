'use strict';

import Transaction from './transaction.js';

class Company extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, name, categories) {

  // only by id
  async update(token, id, update) {
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

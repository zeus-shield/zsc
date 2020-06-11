'use strict';

import Transaction from './transaction.js';

class Press extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, language, content) {
  };

  async removeAll(token, id, language) {
  };

  async remove(token, id, language) {
  };

  async update(token, id, language, content) {
  };

  async getAll() {
    try {
      return await this.transaction('get', 'press/getAll', null);
    } catch (err) {
      throw err;
    }
  };

  async get(id, language) {
  };

  async getByIndex(id, language, index) {
  };

  async count(id, language) {
  };
}

export default Press;

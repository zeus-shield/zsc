'use strict';

import Transaction from './transaction.js';

class QA extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, language, content) {
    const data = new URLSearchParams();
    data.append('language', language);
    data.append('content', JSON.stringify(content));

    try {
      return await this.transaction('post', 'qa/add', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async removeAll(token, id, language) {
    try {
      return await this.transaction('post', 'qa/removeAll', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async remove(token, language, id) {
  };

  async update(token, language, id, content) {
  };

  async getAll() {
    try {
      return await this.transaction('get', 'qa/getAll', null);
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

export default QA;

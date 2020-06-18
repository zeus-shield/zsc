'use strict';

import Transaction from './transaction.js';

class Press extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, language, content) {
    const data = new URLSearchParams();
    data.append('language', language);
    data.append('content', JSON.stringify(content));
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
    const query = new URLSearchParams();
    if (id) {
      query.append('id', id);
    } else if (language) {
      query.append('language', language);
    } else {}
    query.append('index', index);
  };

  async count(id, language) {
    const query = new URLSearchParams();
    if (id) {
      query.append('id', id);
    } else if (language) {
      query.append('language', language);
    } else {}

    try {
      return await this.transaction('get', 'press/count', null, query);
    } catch (err) {
      throw err;
    }
  };
}

export default Press;

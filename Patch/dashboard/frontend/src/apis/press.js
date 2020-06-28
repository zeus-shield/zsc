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

    try {
      return await this.transaction('post', 'press/add', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async removeAll(token, id, language) {
  };

  async remove(token, id, language) {
    const data = new URLSearchParams();
    data.append('id', id);
    data.append('language', language);
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
    const query = new URLSearchParams();
    if (id) {
      query.append('id', id);
    } else if (language) {
      query.append('language', language);
    } else {}

    try {
      return await this.transaction('get', 'press/get', null, query);
    } catch (err) {
      throw err;
    }
  };

  async getByIndex(id, language, index) {
    const query = new URLSearchParams();
    if (id) {
      query.append('id', id);
    } else if (language) {
      query.append('language', language);
    } else {}
    query.append('index', index);

    try {
      return await this.transaction('get', 'press/getByIndex', null, query);
    } catch (err) {
      throw err;
    }
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

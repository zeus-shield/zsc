'use strict';

import Transaction from './transaction.js';

class Insurance extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, company, category, brief, detail) {
    let data = new URLSearchParams();
    data.append('company', company);
    data.append('category', category);
    data.append('brief', JSON.stringify(brief));
    data.append('detail', JSON.stringify(detail));

    try {
      return await this.transaction('post', 'insurance/add', {token}, null, data);
    } catch (err) {
      throw err;
    }
  };

  async remove(token, id, key) {
  };

  // only by id
  async update(token, id, update) {
    const data = new URLSearchParams();
    data.append('id', id);
    data.append('update', JSON.stringify(update));

    try {
      return await this.transaction('post', 'insurance/update', {token}, null, data);
    } catch (err) {
      throw err;
    }
  };

  async list(token) {
    try {
      return await this.transaction('get', 'insurance', {token});
    } catch (err) {
      throw err;
    }
  };

  async detail(token, id, key) {
    const query = new URLSearchParams();
    if (id) {
      query.append('id', id);
    } else if (key) {
      query.append('key', JSON.stringify(key));
    } else {}

    try {
      return await this.transaction('get', 'insurance/detail', {token}, query);
    } catch (err) {
      throw err;
    }
  };

  // key is { company: company, category: category } or
  //        { company: company, category: category, title: title }
  async count(token, key) {
    const query = new URLSearchParams();
    query.append('key', JSON.stringify(key));

    try {
      return await this.transaction('get', 'insurance/count', {token}, query);
    } catch (err) {
      throw err;
    }
  };
}

export default Insurance;

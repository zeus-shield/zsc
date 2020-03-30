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
  };

  async remove(token, id, key) {
  };

  // only by id
  async update(token, id, update) {
  };

  async list(token) {
    try {
      return await this.transaction('get', 'insurance', {token});
    } catch (err) {
      throw err;
    }
  };

  async detail(token, id, key) {
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

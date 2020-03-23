'use strict';

import Transaction from './transaction.js';

class Insurance extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, company, category, brief, detail) {
  };

  async detail(token, id, key) {
  };

  // key is { company: company, category: category } or
  //        { company: company, category: category, title: title }
  async count(token, key) {
  };
}

export default Insurance;

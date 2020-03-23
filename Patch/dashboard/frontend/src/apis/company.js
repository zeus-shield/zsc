'use strict';

import Transaction from './transaction.js';

class Company extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, name, categories) {
  };

  async groupCategoriesByName(token) {
  };
}

export default Company;

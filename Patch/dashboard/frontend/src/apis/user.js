'use strict';

import Transaction from './transaction.js';

class User extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async statistics(token, company, category, title, sort, limit) {
  };
}

export default User;

'use strict';

import Transaction from './transaction.js';

class Token extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, content) {
  };
}

export default Token;

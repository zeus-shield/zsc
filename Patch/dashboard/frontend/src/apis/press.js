'use strict';

import Transaction from './transaction.js';

class Press extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, language, content) {
  };
}

export default Press;

'use strict';

import Transaction from './transaction.js';

class Press extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, language, content) {
  };

  async removeAll(token, id, language) {
  };

  async remove(token, language, id) {
  };

  async update(token, language, id, content) {
  };
}

export default Press;

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

  async remove(token, id, language) {
  };

  async update(token, id, language, content) {
  };

  async getAll() {
  };

  async get(id, language) {
  };
}

export default Press;

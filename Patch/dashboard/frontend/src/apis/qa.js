'use strict';

import Transaction from './transaction.js';

class QA extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, language, content) {
    const data = new URLSearchParams();
    data.append('language', language);
    data.append('content', JSON.stringify(content));
  };

  async removeAll(token, id, language) {
  };

  async remove(token, language, id) {
  };

  async update(token, language, id, content) {
  };

  async getAll() {
  };

  async get(id, language) {
  };

  async getByIndex(id, language, index) {
  };

  async count(id, language) {
  };
}

export default QA;

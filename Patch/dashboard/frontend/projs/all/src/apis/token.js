'use strict';

import Transaction from './transaction.js';

class Token extends Transaction {
  constructor(instance) {
    super(instance);
  };

  async add(token, content) {
    const data = new URLSearchParams();
    data.append('address', content.address);
    data.append('network', content.network);
    data.append('name', content.name);
    data.append('symbol', content.symbol);
    data.append('decimals', content.decimals);

    try {
      return await this.transaction('post', 'token/add', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async remove(token, id, address, network) {
    const data = new URLSearchParams();
    data.append('id', id);
    data.append('language', address);
    data.append('network', network);

    try {
      return await this.transaction('post', 'token/remove', { token }, null, data);
    } catch (err) {
      throw err;
    }
  };

  async update(token, id, content) {
  };

  async list() {
  };

  async detail(id, address) {
  };
}

export default Token;

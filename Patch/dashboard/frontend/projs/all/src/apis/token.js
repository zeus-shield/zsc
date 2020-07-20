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
  };
}

export default Token;

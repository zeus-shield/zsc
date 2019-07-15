'use strict';

import axios from 'axios';
const user = {
  login(user, password, func) {
    setTimeout(() => {
      func(0);
    }, 500);
  }
};

export default user;

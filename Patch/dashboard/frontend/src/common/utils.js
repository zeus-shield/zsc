
const utils = {
  storage: {
    cookie: {
      set(key, value, expires) {
        if (expires === 'N/A') {
          document.cookie = `${key}=${value};path=/;`;
        } else {
          let exp = new Date();
          exp.setTime(exp.getTime() + expires);
          document.cookie = `${key}=${value};path=/;expires=${exp.toGMTString()};`;
        }

        // Set-Cookie: =[; =]
        // [; expires=][; domain=]
        // [; path=][; secure][; HttpOnly]
      },

      get(key) {
      },
      remove(key) {
        this.set(key, '', -1);
      }
    }
  },
  notice: {
    }
  }
};

export default utils;

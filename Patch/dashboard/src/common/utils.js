
const utils = {
  storage: {
    cookie: {
      set(key, value, expires) {
        if (expires === 'N/A') {
          document.cookie = `${key}=${value};path=/;`;
        } else {
        }
      },
      get(key) {
      },
      remove(key) {
        this.set(key, '', -1);
      }
    }
  }
};

export default utils;

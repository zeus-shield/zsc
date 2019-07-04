
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
      }
    }
  }
};

export default utils;

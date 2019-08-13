
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
        let arr = document.cookie.match(new RegExp(`(^| )${key}=([^;]*)(;|$)`));
        if (arr != null) return (arr[2]);
        return null;
      },

      remove(key) {
        this.set(key, '', -1);
      }
    }
  },
  notice: {
    alert(vm, type, title, msg, buttonText, showClose, showCenter, func) {
      vm.$alert(msg, title, {
        confirmButtonText: buttonText,
        type: type,
        center: showCenter,
        showClose: showClose,
        customClass: 'utils-alert',
        // confirmButtonClass: 'utils-alert-button',
        callback: action => {
          if (func !== null) {
            func(action);
          }
        }
      });
    }
  },
  errCommonHandle(msg, vm) {
  }
};

export default utils;

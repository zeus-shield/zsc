'use strict';

import moment from 'moment';

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
    },
    confirm(vm, type, title, msg, confirmButtonText, cancelButtonText,
      showClose, showCenter, confirmFunc, cancelFunc) {
      vm.$confirm(msg, title, {
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        type: type,
        center: showCenter,
        showClose: showClose,
        customClass: 'utils-confirm'
      }).then(() => {
        if (confirmFunc !== null) {
          confirmFunc();
        }
      }).catch(() => {
        if (cancelFunc !== null) {
          cancelFunc();
        }
      });
    }
  },
  errCommonHandle(msg, vm) {
    let result = false;

    if (msg === 'jwt expired') {
      result = true;
      this.storage.cookie.remove('login_id');
      this.storage.cookie.remove('login_account');
      this.storage.cookie.remove('login_token');
      this.notice.alert(vm, 'warning', vm.langSet.component.alert.warningTitle, vm.langSet.message.warning.jwtExpires, vm.langSet.component.button.confirm, false, true, () => {
        vm.$router.push({name: 'login'});
      });
    } else if (msg === 'jwt malformed') {
      result = true;
      this.storage.cookie.remove('login_id');
      this.storage.cookie.remove('login_account');
      this.storage.cookie.remove('login_token');
      this.notice.alert(vm, 'warning', vm.langSet.component.alert.warningTitle, vm.langSet.message.warning.jwtMalformed, vm.langSet.component.button.confirm, false, true, () => {
        vm.$router.push({name: 'login'});
      });
    } else if (msg === 'invalid token') {
      result = true;
      this.storage.cookie.remove('login_id');
      this.storage.cookie.remove('login_account');
      this.storage.cookie.remove('login_token');
      this.notice.alert(vm, 'warning', vm.langSet.component.alert.warningTitle, vm.langSet.message.warning.invalidToken, vm.langSet.component.button.confirm, false, true, () => {
        vm.$router.push({name: 'login'});
      });
    } else if (msg === 'USER_NOT_EXIST') {
      result = true;
      this.storage.cookie.remove('login_id');
      this.storage.cookie.remove('login_account');
      this.storage.cookie.remove('login_token');
      this.notice.alert(vm, 'error', vm.langSet.component.alert.errorTitle, vm.langSet.message.error.USER_NOT_EXIST, vm.langSet.component.button.confirm, false, true, () => {
        vm.$router.push({name: 'login'});
      });
    } else if (msg === 'TOKEN_IS_MISSING') {
      result = true;
      this.notice.alert(vm, 'error', vm.langSet.component.alert.errorTitle, vm.langSet.message.error.TOKEN_IS_MISSING, vm.langSet.component.button.confirm, false, true, null);
    } else if (msg === 'ROUTE_NOT_EXIST') {
      result = true;
      this.notice.alert(vm, 'error', vm.langSet.component.alert.errorTitle, vm.langSet.message.error.ROUTE_NOT_EXIST, vm.langSet.component.button.confirm, false, true, null);
    } else {}
    return result;
  },
  checkLogin() {
    return (this.storage.cookie.get('login_token') !== null && this.storage.cookie.get('login_account') !== null && this.storage.cookie.get('login_id') !== null && this.storage.cookie.get('login_token') !== 'undefined' && this.storage.cookie.get('login_account') !== 'undefined' && this.storage.cookie.get('login_id') !== 'undefined');
  }
};

export default utils;

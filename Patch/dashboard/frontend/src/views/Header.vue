<template>
  <div class="header">
    <el-row class="header-menu" :gutter="0">
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.header-menu {
  background-color: #232f3e;
  height: 60px;
  padding: 0px 20px;
}
.header-logo {
  background-color: #232f3e;
  height: 60px;

  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.header-memu-slot {
  background-color: #232f3e;
  height: 60px;

  display: flex;
  justify-content: flex-end;
  // align-items: center;

  // display: table-cell;
  // vertical-align: middle;
}
.header-login {
  background-color: #232f3e;
  color: #fff;
  height: 56px;
  width: 30px;
  font-size: 15px;
  padding: 0 20px;
  border: 2px solid #232f3e;
  margin: 0px 10px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}
.header-login:hover {
  background-color: #434A50;
  // color: #ffd04b;
}
.header-signup {
  background-color: rgb(236,145,45);
  color: #fff;
  height: 40px;
  width: 80px;
  font-size: 15px;
  padding: 0 20px;
  margin: 10px 10px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}
.header-lang {
  background-color: #232f3e;
  color: #fff;
  height: 60px;
  font-size: 15px;
  margin: 0px 10px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}
.header-lang-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconfont-symbol {
  font-size: 30px;
  margin-right: 10px;
}
</style>

<script>
import utils from '@/common/utils';

import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Header',
  // components: {
  // },
  data() {
    return {
      user: utils.storage.cookie.get('login_account'),
      login: utils.storage.cookie.get('login_token') !== null && utils.storage.cookie.get('login_account') !== null,

      routes: [
        {id: '1', name: 'home'},
        {id: '21', name: 'insurance'},
        {id: '22', name: 'analytics'},
        {id: '4', name: 'faq'},
        {id: '5', name: 'login'},
        {id: '6', name: 'signUp'},
        {id: '71', name: 'userDetail'},

        {id: '99', name: 'adminUser'}
      ],

      // TODO
      admin: false
    };
  },
  // props: ['activeIndex'],
  props: {
    activeIndex: String
  },
  computed: {
    // ...mapState({
    //   logColor: state => state.logColor.header,
    //   lang: state => state.lang.lang
    // }),
    ...mapState('logColor', {
      logColor: state => state.header
    }),
    ...mapState('lang', ['lang']),
    ...mapGetters('lang', ['langSet', 'langSetByKey'])
  },
  created() {
    console.log('%c[Header]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Header]mounted()', `color:${this.logColor}`);
    // TODO
    this.checkAdmin();
  },
  destroyed() {
    console.log('%c[Header]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Header]updated()', `color:${this.logColor}`);

    // TODO
    this.checkAdmin();

    // login
    if (!this.login) {
      if (this.activeIndex === '5') {
        document.getElementsByClassName('header-login')[0].style = 'color: rgb(255, 208, 75); border-bottom-color: rgb(255, 208, 75)';
      } else {
        document.getElementsByClassName('header-login')[0].style = '';
      }
    }

    this.user = utils.storage.cookie.get('login_account');
    this.login = utils.storage.cookie.get('login_token') !== null && utils.storage.cookie.get('login_account') !== null;
  },
  methods: {
    ...mapActions('lang', [
      'switchLang'
    ]),
    // TODO
    checkAdmin() {
    },
    },
    handleLogin() {
      this.$router.push({name: 'login'});
    },
    handleSignUp() {
      this.$router.push({name: 'signUp'});
    },
    switchLanguage(lang) {
      this.switchLang({lang: lang, vm: this});
    }
  }
};
</script>
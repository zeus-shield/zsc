<template>
  <div class="header">
    <el-row class="header-menu" :gutter="0">

      <!-- logo -->
      <el-col :xs="{span: 4}" :sm="{span: 4}" :md="{span: 4}" :lg="{span: 4}">
        <div class="header-logo">
          <!-- TODO -->
          <img src="@/assets/images/logo.png" style="height: 50px;">
          <img src="@/assets/images/dashboard.png" style="height: 100px; margin-top: 3px;">
        </div>
      </el-col>

      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}">
        <el-menu
          mode="horizontal"
          :default-active="activeIndex"
          @select="handleSelect"
          background-color="#232f3e"
          text-color="#fff"
          active-text-color="#ffd04b">

          <!-- home -->
          <el-menu-item index="1">
            <!-- <router-link tag="span" to="/home">{{langSet[lang].header.home}}</router-link> -->
            {{ langSet.header.home }}
          </el-menu-item>

          <!-- insurance -->
          <el-submenu index="2">
            <template slot="title">
              {{ langSet.header.insurance }}
            </template>
            <el-menu-item index="21">
              <!-- <router-link tag="span" to="/insurance">{{langSet[lang].header.insurance}}</router-link> -->
              {{ langSet.header.market }}
            </el-menu-item>
            <el-menu-item index="22">
              <!-- <router-link tag="span" to="/analytics">{{langSet[lang].header.analytics}}</router-link> -->
              {{ langSet.header.analytics }}
            </el-menu-item>
          </el-submenu>

          <!-- white paper -->
          <el-menu-item index="3">
            {{ langSet.header.whitePaper }}
          </el-menu-item>

          <!-- faq -->
          <!-- <el-menu-item index="4">
            {{ langSet.header.faq }}
          </el-menu-item> -->

          <!-- admin TODO -->
          <el-menu-item v-if="admin === true" index="99">
            <!-- <router-link tag="span" to="/faq">{{langSet[lang].header.faq}}</router-link> -->
            {{ langSet.header.admin }}
          </el-menu-item>

        </el-menu>
      </el-col>

      <el-col :xs="{span: 8}" :sm="{span: 8}" :md="{span: 8}" :lg="{span: 8}">
        <div class="header-memu-slot">

          <!-- login -->
          <div v-if="!login" class="header-login" @click="handleLogin">
            {{ langSet.header.login }}
          </div>
          
          <!-- sign up -->
          <div v-if="!login" class="header-signup" @click="handleSignUp">
            {{ langSet.header.signUp }}
          </div>
      </el-col>
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
      let account = utils.storage.cookie.get('login_account');
      if (account === 'deduotech' || account === '28781835@qq.com') {
        this.admin = true;
      } else {
        this.admin = false;
      }
    },
    // handleSelect(key, keyPath) {
    handleSelect(key) {
      // console.log(key, keyPath);
      if (key === '72') { // logout
        utils.storage.cookie.remove('login_account');
        utils.storage.cookie.remove('login_token');
        utils.storage.cookie.remove('login_id');
        this.$router.push({name: 'home'});
      } else if (key === '3') { // white paper
        if (utils.storage.cookie.get('lang') === 'cn') {
          // window.location.href = 'static/Myinsura_whitepaper_cn_v0.00.02.pdf';
          window.open('static/Myinsura_whitepaper_cn_v0.00.02.pdf');
          this.$router.go(0);
        } else {
          // window.location.href = 'static/Myinsura_whitepaper_en_v0.00.02.pdf';
          window.open('static/Myinsura_whitepaper_en_v0.00.02.pdf');
          this.$router.go(0);
        }
      } else {
        let route = this.routes.find(route => route.id === key);
        let name = (undefined === route) ? '*' : route.name;
        this.$router.push({name: name});
      }
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
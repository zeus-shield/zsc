<template>
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
import utils from '../common/utils';

import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Header',
  // components: {
  // },
  data() {
  },
  // props: ['activeIndex'],
  props: {
    activeIndex: String
  },
  computed: {
  },
  created() {
    console.log('%c[Header]created()', `color:${this.logColor}`);
  },
};
</script>
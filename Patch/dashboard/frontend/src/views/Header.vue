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
}
.header-login:hover {
  background-color: #434A50;
  // color: #ffd04b;
}
.header-signup {
}
.header-lang {
}
.header-lang-item {
}
.iconfont-symbol {
  font-size: 30px;
  margin-right: 10px;
}
</style>

<script>
import utils from '../common/utils';

import { mapState, mapGetters, mapActions } from 'vuex';
</script>
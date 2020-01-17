<template>
  <div class="user" :class="{'user-pc': device === 'pc'}">

    <div v-if="device === 'pc'">
      <el-container >
        <el-aside width="12.375rem">
          <user-aside :activeIndex="activeIndex"></user-aside>
        </el-aside>
        <el-main class="el-main-pc">
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>

    <div v-else>
      <el-container>
        <el-main>
          <user-header :activeIndex="activeIndex"></user-header>
        </el-main>
      </el-container>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.user-pc {
  padding: 1.25rem; // 20px
}
.el-aside {
  background-color: #fff;
  // color: #333;
  // text-align: center;
  // line-height: 200px;
  border-radius: 0.25rem; // 4px;
  // border: 1px solid #e9e9e9;
}
.el-main-pc {
  // background-color: #E9EEF3;
  padding-left: 1.25rem; // 20px
  // color: #333;
  // text-align: center;
  // line-height: 160px;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import UserAside from '@/views/UserAside';
import UserHeader from '@/views/m/UserHeader';

export default {
  name: 'User',
  components: {
    'user-aside': UserAside,
    'user-header': UserHeader
  },
  data() {
    return {
      activeIndex: '1'
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.user.container
    }),
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('device', ['device'])
  },
  created() {
    console.log('%c[User]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[User]mounted()', `color:${this.logColor}`);
    let activeIndex = '1';
  },
  destroyed() {
    console.log('%c[User]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[User]updated()', `color:${this.logColor}`);
    let activeIndex = '1';
  beforeRouteEnter(to, from, next) {
    console.log('%c[User]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      console.log('%c[User]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[User]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[User]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
  }
};
</script>
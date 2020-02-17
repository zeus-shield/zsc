<template>
  <div class="user-aside">
    <div class="menu-container">
      <el-menu
        class="menu"
        :default-active="activeIndex"
        background-color=""
        text-color="#777"
        active-text-color="#f91"
        @select="onSelect"
        @open=""
        @close="">
        <div class="group">
          <i class="el-icon-user icon"></i>
          <span>{{ langSet.user.aside.slot[0].title }}</span>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-container {
  background: #fff;
  position: relative;
  border: 0.0625rem solid #e9e9e9;
  border-radius: 0.25rem; // 4px;
  box-sizing: border-box;
  width: 12.375rem; // 198px;
}
.menu-container .menu {
  width: 100%;
  border-right: 0rem;
}
.menu-container .menu .group {
  height: 2.25rem; // 36px;
  line-height: 2.25rem; // 36px;
  text-align: left;
  border-radius: 0.25rem 0.25rem 0 0;
  font-size: 0.75rem; // 12px;
  color: #5c5c5c;
}
.menu-container .menu .group .icon {
  font-size: 0.875rem; // 14px;
  color: #9aa8b7;
  line-height: 0rem;
  margin-left: 0.8125rem; // 13px;
  margin-right: 0.1875rem; // 3px;
  vertical-align: middle;
}
.menu-container .menu .item {
  width: 100%;
  text-align: left;
  height: 2.25rem; // 36px;
  line-height: 2.25rem; // 36px;
  font-size: 0.875rem; // 14px;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-block;
}
.menu-container .menu .bottom-padding {
  padding-bottom: 0.625rem; // 10px;
}
// .menu-container .menu .bottom-border {
//   border-bottom: 1px solid #e9e9e9;
// }
.menu-container .menu .item.is-active {
  // background-color: rgba(48,117,238,.05);
  // box-shadow: inset 0.1875rem 0 0 0 #409EFF;
  background-color: #fff;
  font-weight: 700;
  box-shadow: inset 0.1875rem 0 0 0 #f91;
}
.menu-container .menu .item:focus {
  background-color: #fff;
}
.menu-container .menu .item:hover {
  background-color: #fff;
}
.menu-container .menu .item span:hover {
  color: #f91;
  text-decoration: underline;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'UserAside',
  // components: {
  // },
  data() {
    return {
      routes: [
        {id: '1', name: 'userDetail'},
        {id: '2', name: 'userPolicy'},
        {id: '3', name: 'userSupport'},
        {id: '4', name: 'userQuestions'}
      ]
    };
  },
  props: {
    activeIndex: String
  },
  computed: {
    ...mapState({
      logColor: state => state.logColor.user.pc.aside
    }),
    ...mapGetters('lang', ['langSet'])
  },
  created() {
    console.log('%c[UserAside]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[UserAside]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[UserAside]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[UserAside]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[UserAside]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      console.log('%c[UserAside]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[UserAside]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[UserAside]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
    // onSelect(key, keyPath) {
    onSelect(key) {
      // console.log(key, keyPath);
      let route = this.routes.find(route => route.id === key);
      let name = (undefined === route) ? '*' : route.name;
      this.$router.push({name: name});
    }
  }
};
</script>
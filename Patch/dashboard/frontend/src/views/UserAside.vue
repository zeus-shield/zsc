<template>
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
.menu-title .icon {
}
.menu .menu-item {
}
.menu-container .menu .bottom-padding {
  padding-bottom: 0.625rem; // 10px;
}
// .menu-container .menu .bottom-border {
//   border-bottom: 1px solid #e9e9e9;
// }
.menu-container .menu .item.is-active {
}
.menu-container .menu .item:focus {
}
.menu-container .menu .item:hover {
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
  },
};
</script>
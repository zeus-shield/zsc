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
.menu-title {
}
.menu-title .icon {
}
.menu .menu-item {
}
.menu-container .menu .bottom-padding {
  padding-bottom: 0.625rem; // 10px;
}
.menu .menu-bottom-border {
  border-bottom: 1px solid #e9e9e9;
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
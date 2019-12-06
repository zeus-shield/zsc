<template>
</template>

<style lang="scss" scoped>
.el-aside {
  background-color: #fff;
  // color: #333;
  // text-align: center;
  // line-height: 200px;
  border-radius: 4px;
  // border: 1px solid #e9e9e9;
}
.el-main {
  // background-color: #E9EEF3;
  padding-top: 0px;
  color: #333;
  // text-align: center;
  // line-height: 160px;
}
</style>

<script>
import UserAside from '@/views/UserAside';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'User',
  components: {
    'user-aside': UserAside
  },
  data() {
    return {
      activeIndex: '1'
    };
  },
  methods: {
  }
};
</script>
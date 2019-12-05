<template>
</template>

<style lang="scss" scoped>
.el-aside {
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
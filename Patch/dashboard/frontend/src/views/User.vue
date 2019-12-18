<template>
  <div class="user">
    <el-container>
      <el-aside width="198px">
        <user-aside :activeIndex="activeIndex"></user-aside>
      </el-aside>
    </el-container>
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
.el-main-mobile {
  padding: 0;
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
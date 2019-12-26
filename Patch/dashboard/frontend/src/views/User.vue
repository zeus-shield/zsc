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
  methods: {
  }
};
</script>
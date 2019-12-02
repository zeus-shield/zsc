<template>
</template>

<style lang="scss" scoped>
.el-aside {
}
.el-main {
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
  methods: {
  }
};
</script>
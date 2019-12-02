<template>
</template>

<style lang="scss" scoped>
.menu .menu-bottom-padding {
  padding-bottom: 10px;
}
.menu .menu-bottom-border {
  border-bottom: 1px solid #e9e9e9;
}
.menu-container .menu .menu-item.is-active, .menu-container .menu .menu-item:hover {
  background: rgba(48,117,238,.05);
  box-shadow: inset 3px 0 0 0 #409EFF;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'UserAside',
  components: {
  },
};
</script>
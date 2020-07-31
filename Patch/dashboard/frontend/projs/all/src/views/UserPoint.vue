<template>
</template>

<style lang="scss" scoped>
.user-point {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.user-point-mobile {
  padding: 1.25rem; // 20px
}
.interval-md {
  margin: 0.5rem; // 8px;
  min-height: 0.25rem; // 4px;
}
<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';
import config from '@/apis/dapp/config';

export default {
  name: 'UserPoint',
  // components: {
  // },
};
</script>

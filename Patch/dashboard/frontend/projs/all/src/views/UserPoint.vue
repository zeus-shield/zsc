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
.interval-lg {
  margin: 1rem; // 16px;
  min-height: 0.5rem; // 8px;
}
.header {
  font-size: 1.5rem; // 24px;
  font-weight: 400;
  padding: 0.5rem 0;
  border-bottom: 0.0625rem solid #e4e4e4;
}
.header .sprite {
}
.point-profile {
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

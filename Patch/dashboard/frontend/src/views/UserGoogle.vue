<template>
</template>

<style lang="scss" scoped>
.user-google-mobile {
  padding: 1.25rem; // 20px
}
.user-google {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.interval-md {
  margin: 0.5rem; // 8px;
  min-height: 0.25rem; // 4px;
}
.interval-lg {
}
.header {
}
.header .sprite {
}
.content {
  counter-reset: num;
}
.content .step:first-child {
  margin-top: 1.25rem; // 20px;
}
.content .step .text:before {
}
.content .step .tip .alert {
}
.content .step .tip .alert .title {
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import user from '@/apis/user';
</script>
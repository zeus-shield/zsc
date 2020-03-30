<template>
  <div class="user-google" :class="{'user-google-mobile': device !== 'pc'}" v-loading="loading" >

    <div class="header">
      <span class="sprite"></span>
      <span v-if="cmd === 'set'">{{ langSet.user.google.title[0] }}</span>
      <span v-else>{{ langSet.user.google.title[1] }}</span>
    </div>
  </div>
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
  margin: 1rem; // 16px;
  min-height: 0.5rem; // 8px;
}
.header {
}
.header .sprite {
}
.content {
  counter-reset: num;
}
// .content .step:first-child {
//   margin-top: 1.25rem; // 20px;
// }
.content .step .text:before {
}
.content .step .tip .alert {
}
.content .step .tip .alert .title {
}
.content .step .tip .alert .description {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.content .step .qr-box.bind {
  margin: auto 1.25rem;
}
.step .qr-box .url,
.step .qr-box .qr {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .step .input-box {
  margin: auto 1.25rem;
}
.content .step .input-box .input,
.step .input-box .button {
  width: 40%;
}
.content .step .input-box .input-mobile,
.step .input-box .button-mobile {
  width: 100%;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import user from '@/apis/user';
</script>
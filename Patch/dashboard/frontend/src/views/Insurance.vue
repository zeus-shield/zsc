<template>
  <div class="insurance">
  </div>
</template>

<style lang="scss">
</style>

<script>
// import dummyData from '../apis/insuranceDummyData';
import InsurancePingAnBrief from '@/views/templates/insurances/pingan/brief';
import InsurancePICCBrief from '@/views/templates/insurances/picc/brief';

import { mapState, mapGetters } from 'vuex';

import utils from '../common/utils';
import APIs from '../apis';

export default {
  name: 'Insurance',
  components: {
    'insurance-pingan-brief': InsurancePingAnBrief,
    'insurance-picc-brief': InsurancePICCBrief
  },
  data() {
  },
  // props: {
  // },
};
</script>
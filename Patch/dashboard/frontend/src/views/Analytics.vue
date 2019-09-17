<template>
  <div class="analytics">
    Analytics
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Analytics',
  // components: {
  // },
  data() {
    return {
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.analytics
    })
  },
};
</script>

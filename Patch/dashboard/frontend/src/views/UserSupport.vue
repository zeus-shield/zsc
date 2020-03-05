<template>
  <div class="user-support">
    UserSupport
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'UserSupport',
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
      logColor: state => state.logColor.user.pc.support
    })
  },
  created() {
    console.log('%c[UserSupport]created()', `color:${this.logColor}`);
  },
  methods: {
  }
};
</script>
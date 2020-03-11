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
  mounted() {
    console.log('%c[UserSupport]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[UserSupport]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[UserSupport]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
  },
  methods: {
  }
};
</script>
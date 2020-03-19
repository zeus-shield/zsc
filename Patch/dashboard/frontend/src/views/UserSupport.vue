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
    console.log('%c[UserSupport]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      console.log('%c[UserSupport]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[UserSupport]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[UserSupport]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
  }
};
</script>
<template>
  <div class="home">
    Home
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Home',
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
      logColor: state => state.logColor.home
    }),
    ...mapGetters('lang', ['langSet'])
  },
  created() {
    console.log('%c[Home]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Home]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[Home]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Home]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[Home]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[Home]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
};
</script>
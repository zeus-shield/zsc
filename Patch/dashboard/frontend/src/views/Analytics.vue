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
  created() {
    console.log('%c[Analytics]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Analytics]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[Analytics]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Analytics]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[Analytics]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[Analytics]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
  }
};
</script>

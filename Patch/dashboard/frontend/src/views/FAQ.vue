<template>
  <div class="faq">
    FAQ
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Mine',
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
      logColor: state => state.logColor.faq
    })
  },
  created() {
    console.log('%c[FAQ]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[FAQ]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[FAQ]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[FAQ]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[FAQ]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      // 通过 `vm` 访问组件实例
      // console.log(vm);
      console.log('%c[FAQ]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[FAQ]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[FAQ]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
  }
};
</script>
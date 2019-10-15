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
  methods: {
  }
};
</script>
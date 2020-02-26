<template>
  <div class="footer">
    <p>Copyright? 2018-2020 Dashboard</p>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  width: 100%;
  float: left;
  height:50px;
  text-align: center;
  background-color: #232f3e; // RGB(52,58,64)
}
.footer p {
  margin-top: 15px;
  color: #fff; // RGB(154,157,160)
}
.footer a {
  font-family: "source sans pro";
  font-weight: 600;
}
</style>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Footer',
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
      logColor: state => state.logColor.footer
    })
  },
  created() {
    console.log('%c[Footer]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Footer]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[Footer]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Footer]updated()', `color:${this.logColor}`);
  },
  methods: {
  }
};
</script>
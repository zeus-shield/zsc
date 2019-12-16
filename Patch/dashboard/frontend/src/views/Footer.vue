<template>
  <div class="footer">
    <p>Copyright? 2018-2019 Dashboard</p>
  </div>
</template>

<style lang="scss" scoped>
.footer {
}
.footer p {
}
.footer a {
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
};
</script>
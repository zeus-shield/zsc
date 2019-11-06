<template>
  <div class="login">
    <el-row :gutter="0">
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.login-alert {
  height: 38px;
  padding: 0px;
  border: 1px solid #E6A23C;
}
.login-form-title {
  text-align: center;
  font-size: 15px;
}
.login-form-button {
  width: 100%;
  font-size: 15px;
}
.dialog .google-auth-form .space {
  margin-top: 22px;
}
.dialog .button {
  width: 50%;
}
</style>

<script>
import utils from '../common/utils';
import user from '../apis/user';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'Login',
  // components: {
  // },
  data() {
    return {
    };
  },
  // props: {
  // },
  computed: {
    // ...mapState({
    //   logColor: state => state.logColor.login
    // })
    ...mapState('logColor', {
      logColor: state => state.login
    }),
    ...mapGetters('lang', ['langSet'])
  },
  created() {
    console.log('%c[Login]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Login]mounted()', `color:${this.logColor}`);
  },
  methods: {
  }
};
</script>
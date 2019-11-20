<template>
  <div class="signup">
    <div>
      <el-row :gutter="0">
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signup-alert {
  height: 38px;
  padding: 0px;
  border: 1px solid #E6A23C;
}
// .signup-form-title {
//   text-align: center;
//   font-size: 15px;
// }
.signup-form-button-code {
  width: 100%;
}
.signup-form-button-submit {
  width: 100%;
  font-size: 15px;
}
</style>

<script>
import utils from '../common/utils';
import user from '../apis/user';
import moment from 'moment';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'SignUp',
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
    //   logColor: state => state.logColor.signUp
    // })
    ...mapState('logColor', {
      logColor: state => state.signUp
    }),
    ...mapGetters('lang', ['langSet'])
  },
  created() {
    console.log('%c[SignUp]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[SignUp]mounted()', `color:${this.logColor}`);
    this.buttonCodeName = this.langSet.signUp.getCode;
  },
  destroyed() {
    console.log('%c[SignUp]destroyed()', `color:${this.logColor}`);
  },
  updated() {
  },
  beforeRouteEnter(to, from, next) {
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[SignUp]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
  },
  }
};
</script>
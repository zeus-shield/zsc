<template>
  <div class="login">
    <el-row :gutter="0">
    </el-row>

    <el-dialog class="dialog" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
      <div class="title" slot="title">
        <span>{{ langSet.login.dialog.title }}</span>
      </div>
    </el-dialog>
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
  destroyed() {
    console.log('%c[Login]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Login]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[Login]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      // console.log(vm);
      console.log('%c[Login]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[Login]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[Login]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
    dialogClose() {
      this.$refs['googleAuthForm'].resetFields();
      this.loading = false;
    },
    inputChange() {
      let vm = this;
      vm.$refs['form'].validate((valid) => {
        vm.buttonSubmitDisabled = !valid;
      });
    },
    googleAuthInputChange() {
      let vm = this;
      vm.$refs['googleAuthForm'].validate((valid) => {
        vm.buttonGoogleAuthDisabled = !valid;
      });
    },
    submitForm(formName) {
    },
    submitGoogleAuthForm(formName) {
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.errorMessage = '';
          user.login(vm.form.account, vm.form.password, vm.googleAuthForm.code).then(data => {
          }).catch(errorData => {
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<template>
  <div class="login">
    <el-row :gutter="0">
      <el-col :xs="{span: 22, offset: 1}" :sm="{span: 14, offset: 5}" :md="{span: 12, offset: 6}" :lg="{span: 8, offset: 8}">
        <el-card shadow="hover">
        </el-card>
      </el-col>
    </el-row>

    <el-dialog class="dialog" :visible.sync="dialogVisible" :width="dialogWidth" @close="dialogClose">
      <div class="title" slot="title">
        <span>{{ langSet.login.dialog.title }}</span>
      </div>
      <el-form class="google-auth-form" ref="googleAuthForm" :model="googleAuthForm" label-width="0px" label-position="left" :rules="googleAuthRules">
        <div class="space"></div>
        <el-form-item prop="code">
          <el-input class="input" v-model="googleAuthForm.code" prefix-icon="iconfont if-password" :placeholder="langSet.login.dialog.placeholder" @input="googleAuthInputChange"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="button" type="primary" :disabled="buttonGoogleAuthDisabled" @click="submitGoogleAuthForm('googleAuthForm')">{{ langSet.login.dialog.buttonText }}</el-button>
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
  margin-top: 1.375rem; // 22px;
}
.dialog .button {
  width: 50%;
}
</style>

<script>
import utils from '../common/utils';
import user from '../apis/user';

import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Login',
  // components: {
  // },
  data() {
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.langSet['message']['error']['LOGIN_ACCOUNT_NONE']));
      } else {
        if (value.length < 6 || value.length > 18) {
          callback(new Error(this.langSet['message']['error']['LOGIN_ACCOUNT_LEN_ERR']));
        } else {
          callback();
        }
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.langSet['message']['error']['LOGIN_PWD_NONE']));
      } else {
        if (value.length < 3 || value.length > 6) {
          callback(new Error(this.langSet['message']['error']['LOGIN_PWD_LEN_ERR']));
        } else {
          callback();
        }
      }
    };
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.langSet['message']['error']['USER_GOOGLE_CODE_NONE']));
      } else {
        if (value.length !== 6) {
          callback(new Error(this.langSet['message']['error']['USER_GOOGLE_CODE_LEN_ERR']));
        } else {
          callback();
        }
      }
    };
    return {
      errorMessage: '',
      loading: false,
      buttonSubmitDisabled: true,
      buttonGoogleAuthDisabled: true,
      dialogVisible: false,
      dialogWidth: '0%',
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
        ],
        password: [
        ]
      },
      googleAuthForm: {
        code: ''
      },
      googleAuthRules: {
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      }
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
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('device', ['device'])
  },
  created() {
    console.log('%c[Login]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Login]mounted()', `color:${this.logColor}`);
    this.setDialogWidth();
    if (this.device === 'pc') {
      window.onresize = () => {
        this.setDialogWidth();
      };
    }
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
    setDialogWidth() {
      var width = document.body.clientWidth;
      if (width >= 1920) {
        this.dialogWidth = '40%'; // xl
        // this.dialogLabelWidth = '35%';
      } else if (width >= 1200) {
        this.dialogWidth = '40%'; // lg
        // this.dialogLabelWidth = '35%';
      } else if (width >= 992) {
        this.dialogWidth = '70%'; // md
        // this.dialogLabelWidth = '35%';
      } else if (width >= 768) {
        this.dialogWidth = '90%'; // sm
        // this.dialogLabelWidth = '35%';
      } else {
        this.dialogWidth = '100%'; // xs
        // this.dialogLabelWidth = '50%';
      }
    },
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
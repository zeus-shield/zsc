<template>
  <div class="signup">
    <div>
      <el-row :gutter="0">
        <el-col :xs="{span: 22, offset: 1}" :sm="{span: 14, offset: 5}" :md="{span: 12, offset: 6}" :lg="{span: 8, offset: 8}">
          <el-card shadow="hover"> 
            <el-form v-loading.fullscreen.lock="loading" :element-loading-text="langSet.component.loading.signUp" element-loading-spinner="el-icon-loading" ref="form" :model="form" :rules="rules" label-width="0">
              <!-- <el-form-item>
                <div class="signup-form-title">
                  <span>{{langSet.signUp.title}}</span>
                </div>
              </el-form-item> -->
              <el-form-item v-if="errorMessage !== ''">
                <el-alert class = "signup-alert"
                  :title="langSet.message.error[errorMessage]"
                  type="error"
                  :closable="false"
                  show-icon>
                </el-alert>
              </el-form-item>
              <el-tabs class="signup-tabs" type="card" value="signup-tab-email" @tab-click="tabClick">
                <el-tab-pane :label="langSet.signUp.emailTitle" name="signup-tab-email">
                </el-tab-pane>
              </el-tabs>
              <el-form-item>
                <el-button class="signup-form-button-submit" type="primary" :disabled="buttonSubmitDisabled" @click="submitForm('form')">{{langSet.signUp.submit}}</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
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
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'SignUp',
  // components: {
  // },
  data() {
    let vm = this;
    let validatePhoneAccount = (rule, value, callback) => {
      // skip validate email
      if (vm.tabIndex === '0') {
        callback();
      } else {
        if (value === '') {
          vm.buttonCodeDisabled = true;
          callback(new Error(vm.langSet['message']['error']['SIGNUP_ACCOUNT_NONE']));
        } else {
          if (value.length < 6 || value.length > 18) {
            vm.buttonCodeDisabled = true;
            callback(new Error(vm.langSet['message']['error']['SIGNUP_ACCOUNT_LEN_ERR']));
          } else {
            if (vm.codeStatus !== 'getting') {
              vm.buttonCodeDisabled = false;
            }
            callback();
          }
        }
      }
    };
    let validateEmailAccount = (rule, value, callback) => {
      // skip validate phone
      if (vm.tabIndex === '1') {
        callback();
      } else {
        if (value === '') {
          vm.buttonCodeDisabled = true;
          callback(new Error(vm.langSet['message']['error']['SIGNUP_ACCOUNT_NONE']));
        } else {
          if (value.length < 6 || value.length > 18) {
            vm.buttonCodeDisabled = true;
            callback(new Error(vm.langSet['message']['error']['SIGNUP_ACCOUNT_LEN_ERR']));
          } else {
            if (vm.codeStatus !== 'getting') {
              vm.buttonCodeDisabled = false;
            }
            callback();
          }
        }
      }
    };
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(vm.langSet['message']['error']['SIGNUP_CODE_NONE']));
      } else {
        if (value.length !== 6) {
          callback(new Error(vm.langSet['message']['error']['SIGNUP_CODE_LEN_ERR']));
        } else {
          callback();
        }
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(vm.langSet['message']['error']['SIGNUP_PWD_NONE']));
      } else {
        if (value.length < 3 || value.length > 6) {
          callback(new Error(vm.langSet['message']['error']['SIGNUP_PWD_LEN_ERR']));
        } else {
          callback();
        }
      }
    };
    let validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(vm.langSet['message']['error']['SIGNUP_PWD_NONE']));
      } else {
        if (value !== vm.form.password) {
          callback(new Error(vm.langSet['message']['error']['SIGNUP_PWD2_ERR']));
        } else {
          callback();
        }
      }
    };
    return {
      errorMessage: '',
      loading: false,
      tabIndex: '0',
      buttonCodeName: '',
      buttonCodeDisabled: true,
      codeStatus: 'none', // none/getting/timeout
      buttonSubmitDisabled: true,
      form: {
        phoneAccount: '',
        emailAccount: '',
        code: '',
        password: '',
        password2: ''
      },
      rules: {
        phoneAccount: [
          // { required: true, message: '请输入手机号/邮箱地址', trigger: 'blur' },
          // { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          { validator: validatePhoneAccount, trigger: 'blur' }
        ],
        emailAccount: [
          // { required: true, message: '请输入手机号/邮箱地址', trigger: 'blur' },
          // { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          { validator: validateEmailAccount, trigger: 'blur' }
        ],
        code: [
          // { required: true, message: '请输入手机号/邮箱地址', trigger: 'blur' },
          // { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          { validator: validateCode, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePassword2, trigger: 'blur' }
        ]
      }
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
    console.log('%c[SignUp]updated()', `color:${this.logColor}`);
    if (this.codeStatus === 'getting') {
    } else if (this.codeStatus === 'timeout') {
      this.buttonCodeName = this.langSet.signUp.retrieveCode;
    } else {
      this.buttonCodeName = this.langSet.signUp.getCode;
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[SignUp]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      // console.log(vm);
      console.log('%c[SignUp]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[SignUp]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[SignUp]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
    inputChange() {
      let vm = this;
      vm.$refs['form'].validate((valid) => {
        // alert(valid);
        vm.buttonSubmitDisabled = !valid;
      });
    },
    tabClick(tab, event) {
      console.log(tab, event);
      this.tabIndex = tab.index;
      this.$refs['form'].resetFields();
    },
    getCode() {
      let vm = this;

      vm.errorMessage = '';
      vm.buttonCodeDisabled = true;
      vm.codeStatus = 'getting';

      let account = '';
      if (vm.tabIndex === '1') {
        account = vm.form.phoneAccount;
      } else if (vm.tabIndex === '0') {
        account = vm.form.emailAccount;
      }

      APIs.user.buildEmailCode(account).then(data => {
        let now = Date.now();
        let expires = moment(data.content.active_expires_at).valueOf();
        let timeout = Math.ceil((expires - now) / 1000);
        console.log('%c[SignUp]timeout(%s)', `color:${vm.logColor}`, timeout);

        let interval = window.setInterval(() => {
          vm.buttonCodeName = timeout + 's';
          --timeout;
          vm.buttonCodeDisabled = true;
          if (timeout < 0) {
            vm.buttonCodeName = vm.langSet.signUp.retrieveCode;
            window.clearInterval(interval);
            vm.buttonCodeDisabled = false;
            vm.codeStatus = 'timeout';
          }
        }, 1000);
      }).catch(errorData => {
        // vm.errorMessage = errorData.errorMessage;
        let errorMessage = '';
        if (errorData.errorMessage !== undefined) {
          errorMessage = errorData.errorMessage;
        } else {
          errorMessage = errorData;
        }

        if (errorMessage.indexOf('timeout') !== -1) { // timeout of 2000ms exceeded
          vm.errorMessage = 'TIMEOUT'; // vm.langSet.message.error.timeout;
        } else {
          vm.errorMessage = errorMessage;
        }

        vm.buttonCodeDisabled = false;
        vm.codeStatus = 'none';
      });
    },
    submitForm(formName) {
    }
  }
};
</script>
<template>
  <div class="signup">
    <div>
      <el-row :gutter="0">
        <el-col :xs="{span: 22, offset: 1}" :sm="{span: 14, offset: 5}" :md="{span: 12, offset: 6}" :lg="{span: 8, offset: 8}">
          <el-card shadow="hover"> 
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
import utils from '../common/utils';
import user from '../apis/user';
import moment from 'moment';

import { mapState, mapGetters } from 'vuex';

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
        } else {
        }
      }
    };
    let validateEmailAccount = (rule, value, callback) => {
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
    };
    let validatePassword2 = (rule, value, callback) => {
    };
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
    },
    submitForm(formName) {
    }
  }
};
</script>
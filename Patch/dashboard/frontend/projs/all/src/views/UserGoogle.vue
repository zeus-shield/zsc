<template>
  <div class="user-google" :class="{'user-google-mobile': device !== 'pc'}" v-loading="loading" >

    <div class="header">
      <span class="sprite"></span>
      <span v-if="cmd === 'set'">{{ langSet.user.google.title[0] }}</span>
      <span v-else>{{ langSet.user.google.title[1] }}</span>
    </div>

    <div class="interval-md"></div>

    <div class="content">
      <div class="step">
        <div class="text">
          <span>{{ langSet.user.google.step[0].text }}</span>
        </div>

        <div class="interval-md"></div>

        <div class="tip">
          <el-alert class="alert" type="warning" :closable="false" show-icon>
            <template slot="title">
              <span class="title">{{ langSet.user.google.step[0].tip.title }}</span>
            </template>
            <template>
              <span class="description">{{ langSet.user.google.step[0].tip.description }}</span>
            </template>
          </el-alert>
        </div>

        <div class="interval-md"></div>

        <div class="qr-box bind">
          <div :class="{ 'url': device !== 'pc' }">
            <!-- <canvas height="168" width="168" style="height: 112px; width: 112px;"> -->
            <qriously :value="QRUrl" :size="112"></qriously>
            <!-- </canvas> -->
          </div>
          <div :class="{ 'qr': device !== 'pc' }">
            <span>{{ langSet.user.google.step[0].qr }}: {{ key }}</span>
          </div>
        </div>
      </div>

      <div class="interval-md"></div>

      <div class="step"> 
        <div class="text">
          <span>{{ langSet.user.google.step[1].text }}</span>
        </div>

        <div class="interval-md"></div>

        <div class="input-box">
          <el-form ref="form" :model="form" label-width="0%" label-position="left" :rules="rules">
            <el-form-item prop="code">
              <el-input class="input" :class="{'input-mobile': device !== 'pc'}" v-model="form.code" prefix-icon="iconfont if-password" :placeholder="langSet.user.google.step[1].form.placeholder" @input="onInput"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="button" :class="{'button-mobile': device !== 'pc'}" type="primary" :disabled="buttonDisabled" @click="onSubmit('form')">{{ langSet.user.google.step[1].form.buttonText }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.user-google-mobile {
  padding: 1.25rem; // 20px
}
.user-google {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.interval-md {
  margin: 0.5rem; // 8px;
  min-height: 0.25rem; // 4px;
}
.interval-lg {
  margin: 1rem; // 16px;
  min-height: 0.5rem; // 8px;
}
.header {
  font-size: 1.5rem; // 24px;
  font-weight: 400;
  padding: 0.5rem 0;
  border-bottom: 0.0625rem solid #e4e4e4;
}
.header .sprite {
  display: inline-block;
  background: transparent url(../assets/images/icon-sprite.png) no-repeat 100% 100%;
  background-position: -2.4375rem -2.375rem; // -39px -38px;
  width: 1.125rem; // 18px;
  height: 1.125rem; // 18px;
  min-height: 1.125rem; // 18px;
  max-height: 1.125rem; // 18px;
}
.content {
  counter-reset: num;
}
// .content .step:first-child {
//   margin-top: 1.25rem; // 20px;
// }
.content .step .text:before {
  display: inline-block;
  margin-right: 0.5rem; // 8px;
  background-color: #3075ee;
  color: #fff;
  width: 1rem; // 16px;
  height: 1rem; // 16px;
  line-height: 1rem; // 16px;
  text-align: center;
  border-radius: 50%;
  counter-increment: num; 
  content: counter(num);
}
.content .step .tip .alert {
  border-radius: 0.25rem;
  border: thin solid #dc6b04;
  box-shadow: 0 0.125rem 1.25rem 0 rgba(0,0,0,.05);
  background-color: #fffbe9;
  // padding: 0.75rem 1.5rem;
}
.content .step .tip .alert .title {
  font-size: 0.875rem; // 14px;
  font-weight: 700;
  color: #444;
}
.content .step .tip .alert .description {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.content .step .qr-box.bind {
  margin: auto 1.25rem;
}
.step .qr-box .url,
.step .qr-box .qr {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .step .input-box {
  margin: auto 1.25rem;
}
.content .step .input-box .input,
.step .input-box .button {
  width: 40%;
}
.content .step .input-box .input-mobile,
.step .input-box .button-mobile {
  width: 100%;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'UserGoogle',
  // components: {
  // },
  data() {
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
      loading: false,
      QRUrl: '',
      key: '',
      buttonDisabled: true,
      form: {
        code: ''
      },
      rules: {
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      active: false
    };
  },
  props: {
    cmd: ''
  },
  computed: {
    ...mapState({
      logColor: state => state.logColor.user.google
    }),
  },
};
</script>

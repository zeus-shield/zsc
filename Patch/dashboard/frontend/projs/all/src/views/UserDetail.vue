<template>
  <div class="user-datail" :class="{'user-datail-mobile': device !== 'pc'}">

    <div class="account">
      <div class="header">
        <span class="sprite"></span>
        <span>{{ langSet.user.detail.account.title }}</span>
      </div>

      <div class="interval-md"></div>

      <el-alert class="tip" type="warning" :closable="false" show-icon>
        <template slot="title">
          <span class="title">{{ langSet.user.detail.account.tip.title }}</span>
        </template>
        <template>
          <span class="description">{{ langSet.user.detail.account.tip.description }}</span>
        </template>
      </el-alert>

      <div class="interval-md"></div>

      <el-row class="info" :gutter="0" type="flex" justify="start">
        <el-col :xs="{span: 10, offset: 0}" :sm="{span: 10, offset: 0}" :md="{span: 10, offset: 0}" :lg="{span: 5, offset: 0}">
          <span class="title">{{ langSet.user.detail.account.info.title[0] }}</span>
          <br>
          <span class="content">{{ account }}</span>
        </el-col>
        <el-col class="gap" :span="2">
          <div class="line"></div>
        </el-col>
        <el-col :xs="{span: 12, offset: 0}" :sm="{span: 12, offset: 0}" :md="{span: 12, offset: 0}" :lg="{span: 5, offset: 0}">
          <span class="title">{{ langSet.user.detail.account.info.title[1] }}</span>
          <br>
          <span class="content">{{ lastLoginAt }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="interval-lg"></div>

    <div class="security">
      <div class="header">
        <span class="sprite"></span>
        <span>{{ langSet.user.detail.security.title }}</span>
      </div>

      <el-row class="row" :gutter="0" type="flex" justify="space-between">
        <el-col class="col" :xs="{span: 6, offset: 0}" :sm="{span: 6, offset: 0}" :md="{span: 6, offset: 0}" :lg="{span: 4, offset: 0}">
          <span>{{ langSet.user.detail.security.google.title }}</span>
          <el-tooltip v-if="device !== 'pc'" placement="right" effect="dark">
            <div slot="content">{{ langSet.user.detail.security.google.description }}</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
          <div v-else></div>
        </el-col>
        
        <el-col v-if="device === 'pc'" class="col" :span="1">
          <i class="el-icon-success icon"></i>
        </el-col>
        <el-col v-else class="col" :span="0"></el-col>

        <el-col v-if="device === 'pc'" class="col" :span="15">
          <span class="description">{{ langSet.user.detail.security.google.description }}</span>
        </el-col>
        <el-col v-else class="col" :span="0"></el-col>

        <el-col class="col" :xs="{span: 10, offset: 0}" :sm="{span: 10, offset: 0}" :md="{span: 10, offset: 0}" :lg="{span: 4, offset: 0}">
          <el-button class="button" type="text" @click="$router.push({name: 'userGoogle', params: {cmd: cmd}});">{{ (cmd === 'set') ? langSet.user.detail.security.google.operation.set : langSet.user.detail.security.google.operation.reset }}</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-switch v-if="cmd === 'reset'" v-model="GoogleAuthOn" :active-text="langSet.user.detail.security.google.operation.open" @change="dialogVisible = true">
          </el-switch>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="dialog" :visible.sync="dialogVisible" :width="dialogWidth" @close="onDialogClose">
      <div slot="title">
        <span>{{ langSet.user.detail.dialog.title }}</span>
      </div>
      <el-form class="form" ref="form" :model="form" label-width="0rem" label-position="left" :rules="rules">
        <div class="space"></div>
        <el-form-item prop="code">
          <el-input class="input" v-model="form.code" prefix-icon="iconfont if-password" :placeholder="langSet.user.detail.dialog.placeholder" @input="onInput"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button class="button" type="primary" :disabled="buttonDisabled" @click="onSubmit('form')">{{ langSet.user.detail.dialog.buttonText }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
.user-datail-mobile {
  padding: 1.25rem; // 20px
}
.user-datail {
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
.account .header,
.security .header {
  font-size: 1.5rem; // 24px;
  font-weight: 400;
  padding: 0.5rem 0;
  border-bottom: 0.0625rem solid #e4e4e4;
}
.account .header .sprite,
.security .header .sprite {
  display: inline-block;
  background: transparent url(../assets/images/icon-sprite.png) no-repeat 100% 100%;
  background-position: -2.4375rem -2.375rem; // -39px -38px;
  width: 1.125rem; // 18px;
  height: 1.125rem; // 18px;
  min-height: 1.125rem; // 18px;
  max-height: 1.125rem; // 18px;
}
.account .tip {
  // margin: 1.25rem auto;
  border-radius: 0.25rem;
  border: thin solid #dc6b04;
  box-shadow: 0 0.125rem 1.25rem 0 rgba(0,0,0,.05);
  background-color: #fffbe9;
  // padding: 0.75rem 1.5rem;
}
.account .tip .title {
  font-size: 0.875rem; // 14px;
  font-weight: 700;
  color: #444;
}
.account .tip .description {
  font-size: 0.875rem; // 14px;
  color: #444;
}
.account .info {
  // margin: 1.25rem auto;
  box-shadow: 0 0.125rem 1.25rem 0 rgba(0,0,0,.05);
  border-radius: 0.25rem;
  // padding: 1.5rem;
  // padding: 0.75rem 1.5rem;
  padding: 0.75rem 0.5rem;
}
.account .info .gap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.account .info .gap .line {
  content: "";
  height: 70%;
  width: 0.0625rem;
  background-color: #e4e4e4;
}
.account .info .title {
  color: #999;
}
.account .info .content {
  font-weight: 700;
}
.security .row {
  // padding: 0.75rem 1.5rem;
  // border-bottom: 1px solid #e9e9e9;
}
.security .row .col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.security .row .icon {
  font-size: 1rem; // 16px;
  color: #67C23A;
}
.security .row .description {
  color: #999;
}
.dialog .form .space {
  margin-top: 1.375rem; // 22px;
}
.dialog .button {
  width: 50%;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'UserDetail',
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
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.user.detail
    }),
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('device', ['device'])
  },
  created() {
    console.log('%c[UserDetail]created()', `color:${this.logColor}`);
  },
  mounted() {
  },
  destroyed() {
    console.log('%c[UserDetail]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[UserDetail]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
  },
};
</script>

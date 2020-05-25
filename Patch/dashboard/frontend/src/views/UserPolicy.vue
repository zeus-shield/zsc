<template>
  <div class="user-policy" :class="{'user-policy-mobile': device !== 'pc'}" v-loading.fullscreen.lock="load.doing" :element-loading-text="load.text" element-loading-spinner="el-icon-loading" >
    <div class="header">
      <span class="sprite"></span>
      <span>{{ langSet.user.aside.slot[0].item[1] }}</span>
    </div>

    <el-collapse class="collapse" accordion>
      <el-collapse-item v-for="(item, index) in policies" :key="index">
        <template slot="title"> 
          <span class="title">
            {{ device === 'pc' ? item.insurance.company + ' - ' + item.insurance.category + ' - ' + item.insurance.title : item.insurance.title }}
          </span>
        </template>

        <el-form :inline="device === 'pc'" size="mini" label-position="left" :label-width="labelWidth">

          <div v-if="device !== 'pc'">
            <el-divider content-position="left">
              <span class="divider">{{ langSet.market.dialog.product.title }}</span>
            </el-divider>
            <el-form-item class="el-form-item-mobile">
              <span class="label" slot="label">{{ langSet.market.dialog.product.company }}</span>
              <span class="content">{{ item.insurance.company }}</span>
            </el-form-item>
          </div>

          <el-divider content-position="left">
            <span class="divider">{{ langSet.market.dialog.user.title }}</span>
          </el-divider>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss" scoped>
.user-policy-mobile {
  padding: 1.25rem; // 20px
}
.user-policy {
  font-size: 0.875rem; // 14px;
  color: #444;
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
.collapse {
  counter-reset: num;
}
.collapse .title {
  font-size: 0.875rem; // 14px;
  font-weight: 400;
}
.collapse .title:before {
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
.collapse .divider {
  font-size: 0.75rem; // 14px;
  color: #999;
}
.collapse .label {
  font-size: 0.875rem; // 14px;
  color: #3075ee; // #16b; // #99a9bf;
}
.collapse .content {
  font-size: 0.875rem; // 14px;
}
.collapse .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.collapse .el-form-item-mobile {
  width: 100%;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'UserPolicy',
  // components: {
  // },
  data() {
    return {
      load: {
        doing: false,
        text: ''
      },
      policies: [],
      labelWidth: '20%'
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.user.pc.policy
    }),
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('device', ['device'])
  },
  created() {
    console.log('%c[UserPolicy]created()', `color:${this.logColor}`);
  },
  mounted() {
  },
  destroyed() {
    console.log('%c[UserPolicy]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[UserPolicy]updated()', `color:${this.logColor}`);
  },
};
</script>

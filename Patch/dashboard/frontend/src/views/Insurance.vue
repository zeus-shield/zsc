<template>
  <div class="insurance">

    <el-tabs v-loading.fullscreen.lock="loading" :element-loading-text="langSet.component.loading.insurance" tab-position="left" v-model="companyActiveName" @tab-click="handleCompanyClick">

      <el-tab-pane :key="company.name" v-for="(company, index) in cacheData.companies" :label="company.name" :name="company.name">
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<style lang="scss" scoped>
.insurance {
  padding: 1.25rem; // 20px
}
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab-icon {
   margin-right: 5px;
   width: 20px;
   height: 18px;
   background: url(../assets/images/insurances/picc/icons_side_menu.gif);
}
</style>

<script>
// import dummyData from '../apis/insuranceDummyData';
import InsurancePingAnBrief from '@/views/templates/insurances/pingan/brief';
import InsurancePICCBrief from '@/views/templates/insurances/picc/brief';

import { mapState, mapGetters } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'Insurance',
  components: {
    'insurance-pingan-brief': InsurancePingAnBrief,
    'insurance-picc-brief': InsurancePICCBrief
  },
  data() {
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.insurance.base
    }),
    ...mapGetters('lang', ['langSet'])
  },
  created() {
    console.log('%c[Insurance]created()', `color:${this.logColor}`);
  },
  mounted() {
  },
  destroyed() {
    console.log('%c[Insurance]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Insurance]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[Insurance]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      console.log('%c[Insurance]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[Insurance]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
};
</script>
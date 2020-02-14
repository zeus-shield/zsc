<template>
  <div class="insurance">

    <el-tabs v-loading.fullscreen.lock="loading" :element-loading-text="langSet.component.loading.insurance" tab-position="left" v-model="companyActiveName" @tab-click="handleCompanyClick">

      <el-tab-pane :key="company.name" v-for="(company, index) in cacheData.companies" :name="company.name">
        <div class="tab-company" slot="label">
          <span>{{ company.name }}</span>
        </div>
      </el-tab-pane>

      <el-tab-pane>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<style lang="scss" scoped>
.insurance {
  padding: 1.25rem; // 20px
  font-size: 0.875rem;
  color: #444;
}
.button {
  font-size: 0.875rem;
  color: #fff;
  // border-color: #e76d0c #e15500 #e15500;
  // background-color: #ec7211;
  // background-image: linear-gradient(180deg,#f67c1b 0,#e15500);
}
.search {
  font-size: 0.875rem;
  width: 100%;
}
// .tab-company:hover {
//   color: #f91;
// }
// .tab {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
// .tab-icon {
//   margin-right: 5px;
//   width: 20px;
//   height: 18px;
//   background: url(../assets/images/insurances/picc/icons_side_menu.gif);
// }
// .tab:hover {
//   background: white;
// }
// .tab:hover .tab-icon.car {
//   background-position: -20px 0px;
// }
// .tab-icon.travel {
//   background-position: 0px -18px;
// }
// .tab:hover .tab-icon.travel {
//   background-position: -20px -18px;
// }
// .tab-icon.crash {
//   background-position: 0px -36px;
// }
.tab:hover .tab-icon.crash {
  background-position: -20px -36px;
}
.tab-icon.home {
  background-position: 0px -54px;
}
.tab:hover .tab-icon.home {
  background-position: -20px -54px;
}
.tab-icon.baggage {
  background-position: 0px -72px;
}
.tab:hover .tab-icon.baggage {
  background-position: -20px -72px;
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
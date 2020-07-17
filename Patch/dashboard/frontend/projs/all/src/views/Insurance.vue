<template>
  <div class="insurance">

    <el-tabs v-loading.fullscreen.lock="loading" :element-loading-text="langSet.component.loading.insurance" tab-position="left" v-model="companyActiveName" @tab-click="handleCompanyClick">

      <el-tab-pane :key="company.name" v-for="(company, index) in cacheData.companies" :name="company.name">
        <div class="tab-company" slot="label">
          <span>{{ company.name }}</span>
        </div>
        <el-tabs v-if="companyActiveIndex !== -1" type="border-card" v-model="categoryActiveName" @tab-click="handleCategoryClick">
          <el-tab-pane
            v-for="(category, index) in cacheData.companies[companyActiveIndex].categories"
            :key="category.name"
            :name="category.name">

            <div class="tab-category" slot="label">
              <i v-if="company.name === '中国平安' || company.name === 'PING AN'" :class="category.iconClass"></i>
              <div v-else-if="company.name === '中国人保' || company.name === 'PICC'" :class="category.iconClass"></div>
              <i v-else :class="category.icon"></i>
              <span>{{ category.name }} ({{ category.count }})</span>
            </div>
            
            <div v-for="(item, index) in insuranceCache('page')" :key="index">
              <insurance-pingan-brief v-if="company.name === '中国平安' || company.name === 'PING AN'" :item="item"></insurance-pingan-brief>
              <insurance-picc-brief v-else-if="company.name === '中国人保' || company.name === 'PICC'" :item="item"></insurance-picc-brief>
              <insurance-picc-brief v-else :item="item"></insurance-picc-brief>
            </div>
          </el-tab-pane>

          <div class="block">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="currentPage"
              :page-sizes="cacheData.setting.pageSizes"
              :page-size="pageSize"
              :total="totalForPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-tabs>
      </el-tab-pane>

      <el-tab-pane>
        <el-button class="button" slot="label" type="primary" size="medium" icon="el-icon-search">搜索</el-button>
        
        <el-input class="search" :autofocus="false" :placeholder="langSet.market.operation.title[1]" v-model="search">
          <i slot="prefix" class="el-icon-search el-input__icon"></i>
        </el-input>

        <div v-for="(item, index) in insuranceCache('search')" :key="index">
          <insurance-pingan-brief v-if="item.company === '中国平安' || item.company === 'PING AN'" :item="item"></insurance-pingan-brief>
          <insurance-picc-brief v-else-if="item.company === '中国人保' || company.company === 'PICC'" :item="item"></insurance-picc-brief>
          <insurance-pingan-brief v-else :item="item"></insurance-pingan-brief>
        </div>
        <div class="block">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="currentPage"
            :page-sizes="cacheData.setting.pageSizes"
            :page-size="pageSize"
            :total="totalForPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
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
// .tab:hover .tab-icon.crash {
//   background-position: -20px -36px;
// }
// .tab-icon.home {
//   background-position: 0px -54px;
// }
// .tab:hover .tab-icon.home {
//   background-position: -20px -54px;
// }
// .tab-icon.baggage {
//   background-position: 0px -72px;
// }
// .tab:hover .tab-icon.baggage {
//   background-position: -20px -72px;
// }
// .tab-icon.enterprise {
//   background-position: 0px -90px;
// }
// .tab:hover .tab-icon.enterprise {
//   background-position: -20px -90px;
// }
// .tab-icon.person {
//   background-position: 0px -108px;
// }
// .tab:hover .tab-icon.person {
//   background-position: -20px -108px;
// }
</style>

<script>
// import dummyData from '../apis/data/insuranceLiveData';
import InsurancePingAnBrief from '@/views/templates/insurances/pingan/brief';
import InsurancePICCBrief from '@/views/templates/insurances/picc/brief';

import { mapState, mapGetters, mapActions } from 'vuex';

import utils from '@/common/utils';
import APIs from '@/apis';

export default {
  name: 'Insurance',
  components: {
    'insurance-pingan-brief': InsurancePingAnBrief,
    'insurance-picc-brief': InsurancePICCBrief
  },
  data() {
    return {
      // cacheData: {},
      search: '',

      companyActiveName: '',
      companyActiveIndex: 0,

      categoryActiveName: '',
      categoryActiveIndex: -1,

      // for pagination
      pageSize: -1,
      currentPage: -1,
      totalForPage: -1,

      itemsForPage: [],

      loading: false
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.insurance.base
    }),
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('market', ['cacheData']),
    insuranceCache: {
      // getter
      get: function() {
        return function(cmd) {
          if (cmd === 'page') {
            // get insurances by company and category
            let insurances = this.cacheData.insurances.filter(insurance => insurance.company === this.companyActiveName && insurance.category === this.categoryActiveName);

            let offset = this.pageSize * (this.currentPage - 1);
            offset = (offset < this.totalForPage) ? offset : 0;

            return insurances.slice(offset, offset + this.pageSize);
          } else if (cmd === 'total') {
            let insurances = this.cacheData.insurances.filter(insurance => insurance.company === this.companyActiveName && insurance.category === this.categoryActiveName);
            return insurances;
          } else if ('search') {
            if (this.companyActiveIndex !== -1) {
              return [];
            }

            // for total products
            let insurances = this.cacheData.insurances.filter(insurance => insurance.brief.title.includes(this.search));
            // let insurances = this.cacheData.insurances.filter(insurance => this.search && insurance.brief.title.includes(this.search));

            this.totalForPage = insurances.length;

            let offset = this.pageSize * (this.currentPage - 1);
            offset = (offset < this.totalForPage) ? offset : 0;

            return insurances.slice(offset, offset + this.pageSize);
          } else {

          }
        };
      }
      // setter
      // set: function() {}
    }
  },
  created() {
    console.log('%c[Insurance]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Insurance]mounted()', `color:${this.logColor}`);
    let vm = this;

    vm.loading = true;

    vm.recieve().then((data) => {
      vm.buildCache(data);
      vm.loading = false;
      if (vm.cacheData.companies !== undefined && this.cacheData.companies.length !== 0) {
        vm.companyActiveIndex = 0;
        vm.companyActiveName = vm.cacheData.companies[vm.companyActiveIndex].name;

        vm.categoryActiveIndex = 0;
        if (vm.cacheData.companies[vm.companyActiveIndex].categories &&
            vm.cacheData.companies[vm.companyActiveIndex].categories.length > 0) {
          vm.categoryActiveName = vm.cacheData.companies[vm.companyActiveIndex].categories[vm.categoryActiveIndex].name;
        }

        vm.pageSize = vm.cacheData.setting.pageSizes[0];
        vm.currentPage = 1;
        vm.totalForPage = 0;
        vm.updateTotalOfItemsForPage();
      }
    }).catch(errorData => {
      let errorMessage = '';
      vm.loading = false;
      if (errorData.errorMessage !== undefined) {
        errorMessage = errorData.errorMessage;
      } else {
        errorMessage = errorData;
      }
      if (utils.errCommonHandle(errorMessage, vm) !== true) {
        utils.notice.alert(vm, 'error', vm.langSet.component.alert.errorTitle, errorMessage, vm.langSet.component.button.confirm, false, true, null);
      }
    });
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
  beforeRouteLeave(to, from, next) {
    console.log('%c[Insurance]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
    async recieve() {
    },
    buildCompanyCategoryCount() {
      this.cacheData.companies.forEach(company => {
      });
    },
    updateTotalOfItemsForPage() {
      if (this.companyActiveIndex !== -1) {
        let categories = this.cacheData.companies[this.companyActiveIndex].categories;

        if (categories === undefined || categories.length === 0) {
          this.totalForPage = 0;
        } else {
          this.totalForPage = this.cacheData.companies[this.companyActiveIndex].categories[this.categoryActiveIndex].count;
        }
      } else {
        this.totalForPage = this.cacheData.insurances.length;
      }
    },
    handleCompanyClick(vm) {
      // check index
      if (parseInt(vm.index, 10) > this.cacheData.companies.length - 1) {
      }

      // update active index and name
      this.companyActiveIndex = this.cacheData.companies.findIndex(value => value.name === this.companyActiveName);
      if (this.companyActiveIndex === -1 ||
          this.cacheData.companies[this.companyActiveIndex].categories === undefined ||
          this.cacheData.companies[this.companyActiveIndex].categories.length === 0) {
        this.categoryActiveName = '';
        this.categoryActiveIndex = -1;
        this.updateTotalOfItemsForPage();
        this.currentPage = 1;
      } else {
      }
    },
    // handleCategoryClick(tab, event) {
    handleCategoryClick() {
      // update category active index
      this.categoryActiveIndex = this.cacheData.companies[this.companyActiveIndex].categories.findIndex(value => value.name === this.categoryActiveName);

      this.updateTotalOfItemsForPage();
      // this.updateItemsForPage();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.updateItemsForPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.updateItemsForPage();
    }
  }
};
</script>
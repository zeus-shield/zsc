<template>
  <div class="analytics">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="langSet.component.loading.analytics" element-loading-spinner="el-icon-loading" >
      <el-row :gutter="40">
        <el-col :span="24" :md="12">
          <el-card class="echarts-card" shadow="alwamys">
            <div id="chartPie" class="echarts"></div>
          </el-card>
        </el-col>
        <el-col :span="24" :md="12">
          <el-card class="echarts-card" shadow="alwamys">
            <div id="chartBar" class="echarts"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .page-body {
//   width:80%;
//   margin:56px auto auto auto;
// }
.echarts-card {
  text-align: center;
  // background: #FFF0F5;
  margin-bottom: 20px;
}
.echarts {
  width: 100%; 
  height: 400px;
}
// @media (min-width:980px) {
//   .echarts {
//     height:500px;
//   }
// }
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import echarts from 'echarts';

import utils from '@/common/utils';
import user from '@/apis/user';

export default {
  name: 'Analytics',
  // components: {
  // },
  data() {
    return {
      loading: false,

      chartPie: null,
      chartBar: null,

      pieLegendData: [],
      pieSeriesData: [],

      barDataAxis: [],
      barDataShadow: [],
      barData: []
    };
  },
  // props: {
  // },
  computed: {
    ...mapState({
      logColor: state => state.logColor.analytics
    }),
    ...mapGetters('lang', ['langSet']),
    ...mapGetters('device', ['device'])
  },
  created() {
    console.log('%c[Analytics]created()', `color:${this.logColor}`);
  },
  mounted() {
    console.log('%c[Analytics]mounted()', `color:${this.logColor}`);
    let vm = this;
    let errorMessage = '';
    
    vm.loading = true;

    vm.prePie().then(data => {
    }).then(data => {
    }).catch(errorData => {
    }); 
  },
  destroyed() {
    console.log('%c[Analytics]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[Analytics]updated()', `color:${this.logColor}`);
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c[Analytics]beforeRouteEnter(\"%s\" => \"%s\")', 'color:black', from.fullPath, to.fullPath);
    next(vm => {
      console.log('%c[Analytics]beforeRouteEnter(\"%s\" => \"%s\") next', `color:${vm.logColor}`, from.fullPath, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('%c[Analytics]beforeRouteUpdate(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('%c[Analytics]beforeRouteLeave(\"%s\" => \"%s\")', `color:${this.logColor}`, from.fullPath, to.fullPath);
    next();
  },
  methods: {
    async prePie() {
      try {
        return await user.statistics(null, true, true, true, -1, 10);
      } catch (err) {
        throw err;
      }
    },
    async preBar() {
      try {
        return await user.statistics(null, true, false, false, -1, 10);
      } catch (err) {
        throw err;
      }
    },
    drawPie() {
      this.chartPie = echarts.init(document.getElementById('chartPie'));

      let option = {
        title: {
        },
      };
    },
    drawBar() {
    }
  }
};
</script>

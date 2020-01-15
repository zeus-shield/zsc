<template>
  <div class="analytics">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="langSet.component.loading.analytics" element-loading-spinner="el-icon-loading">
      <div class="header">
        <span class="sprite"></span>
        <span>{{ langSet.header.analytics }}</span>
      </div>

      <div class="interval-md"></div>

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
.analytics {
  padding: 1.25rem; // 20px
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
.interval-md {
  margin: 0.5rem; // 8px;
  min-height: 0.25rem; // 4px;
}
.echarts-card {
  text-align: center;
  // background: #FFF0F5;
  margin-bottom: 1rem;
}
.echarts {
  width: 100%; 
  height: 25rem; // 400px;
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
      data.content.forEach(element => {
        if (vm.device === 'pc') {
          vm.pieLegendData.push(element._id.title);
        }
        vm.pieSeriesData.push({value: element.count, name: element._id.title});
      });
      return vm.preBar();
    }).then(data => {
      data.content.forEach(element => {
        vm.barDataAxis.push(element._id.company);
        vm.barData.push(element.count);
      });
      vm.drawPie();
      vm.drawBar();
      vm.loading = false;
    }).catch(errorData => {
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
          text: utils.storage.cookie.get('lang') === 'en' ? 'Insurance ranking' : '险种热度排行榜',
          subtext: utils.storage.cookie.get('lang') === 'en' ? '(TOP10)' : '（排列前十名的险种）',
          x: 'center',
          textStyle: {
            color: '#444',
            fontSize: 18,
            fontWeight: 700
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.pieLegendData
        },
        series: [
          {
            name: utils.storage.cookie.get('lang') === 'en' ? 'Policy: ' : '险种 :',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.pieSeriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.chartPie.setOption(option);
    },
    drawBar() {
      this.chartBar = echarts.init(document.getElementById('chartBar'));
      for (var i = 0; i < this.barData.length; i++) {
        this.barDataShadow.push(20);
      }
      let option = {
        title: {
          text: utils.storage.cookie.get('lang') === 'en' ? 'Company Ranking' : '公司热度排行榜',
          subtext: utils.storage.cookie.get('lang') === 'en' ? '(TOP10)' : '（排列前十名的公司）',
          x: 'center',
          textStyle: {
            color: '#444',
            fontSize: 18,
            fontWeight: 700
          }
        },
        xAxis: {
          data: this.barDataAxis,
          axisLabel: {
            inside: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
        ]
      };
      this.chartBar.setOption(option);
    }
  }
};
</script>

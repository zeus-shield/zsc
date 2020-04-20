<template>
  <div id="app">
    <el-container>
      <el-header v-if="device === 'pc'">
        <header-pc :activeIndex="activeIndex"></header-pc>
      </el-header>
      <header-m v-else :activeIndex="activeIndex"></header-m>
      <el-main v-if="!reload">
        <router-view></router-view>
      </el-main>
      <el-footer>
        <footer-pc v-if="device === 'pc'"></footer-pc>
        <footer-m v-else></footer-m>
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss">
.el-main {
  padding: 0rem;
}
.el-header, .el-footer {
  padding: 0rem;
}
// .is-active {
//   background-color: red;
// }
.iconfont-symbol {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.el-button {
  // background-color: #409EFF;
  // border-color: #409EFF;
  border-radius: 0px;
  // background-color: #f91;
  // border-color: #f91;
}
.el-button--small {
  border-radius: 0px;
}
// .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
//   // background-color: #a0cfff;
//   // border-color: #a0cfff;
//   background-color: #ffce68;
//   border-color: #ffce68;
// }
.el-button--primary:focus, .el-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  background-color: #ffb148;
  border-color: #ffb148;
}
.el-dialog__header {
  font-size: 1.125rem; // 18px;
  font-weight: 400;
  color: #444;
  // padding: 16px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,.05);
}
.el-dialog__body {
  padding: 0px 40px 0px;
}
.el-dialog__footer {
  font-size: 0;
  padding: 10px 40px 20px;
  text-align: center;
  white-space: nowrap;
  border-top: 1px solid rgba(0,0,0,.05);
}
.el-menu-item, .el-submenu__title {
  font-size: 15px;
  /*padding: 0;*/

  /*display: flex;
  justify-content: center;
  align-items: center;*/
}
.el-dropdown-menu {
  background-color: #545c64;
  padding: 5px 0px;
  border: none;
  border-radius: 2px;
}
.el-dropdown-menu__item {
  color: #fff;
  padding: 0px 10px;
}
.el-dropdown-menudown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #434A50;
  color: #fff; // #ffd04b;
}
// .el-popper[x-placement^=top] {
//   margin-bottom:12px
// }
// .el-popper[x-placement^=top] .popper__arrow {
//   bottom:-6px;
//   left:50%;
//   margin-right:3px;
//   border-top-color:#EBEEF5;
//   border-bottom-width:0
// }
// .el-popper[x-placement^=top] .popper__arrow::after {
//   bottom:1px;
//   margin-left:-6px;
//   border-top-color:#FFF;
//   border-bottom-width:0
// }
.el-popper[x-placement^=bottom] {
  // margin-top:12px
  margin-top:5px
}
.el-popper[x-placement^=bottom] .popper__arrow {
  top:-6px;
  left:50%;
  margin-right:3px;
  border-top-width:0;
  // border-bottom-color:#545c64
}
.el-popper[x-placement^=bottom] .popper__arrow::after {
  top:1px;
  margin-left:-6px;
  border-top-width:0;
  // border-bottom-color:#545c64
}
// .el-popper[x-placement^=right] {
//   margin-left:12px
// }
// .el-popper[x-placement^=right] .popper__arrow {
//   top:50%;
//   left:-6px;
//   margin-bottom:3px;
//   border-right-color:#EBEEF5;
//   border-left-width:0
// }
// .el-popper[x-placement^=right] .popper__arrow::after {
//   bottom:-6px;
//   left:1px;
//   border-right-color:#FFF;
//   border-left-width:0
// }
// .el-popper[x-placement^=left] {
//   margin-right:12px
// }
// .el-popper[x-placement^=left] .popper__arrow {
//   top:50%;
//   right:-6px;
//   margin-bottom:3px;
//   border-right-width:0;
//   border-left-color:#EBEEF5
// }
// .el-popper[x-placement^=left] .popper__arrow::after {
//   right:1px;
//   bottom:-6px;
//   margin-left:-6px;
//   border-right-width:0;
//   border-left-color:#FFF
// }
.el-tabs__item {
  color: #444;
}
.el-tabs__item.is-active {
  color: #f91;
  // font-weight: 700;
}
.el-tabs__item:hover {
  color: #f91;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #444;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #f91;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  color: #f91;
}
.el-tabs__active-bar {
  background-color: #f91;
}
.el-tabs--left .el-tabs__active-bar.is-left, .el-tabs--left .el-tabs__active-bar.is-right, .el-tabs--right .el-tabs__active-bar.is-left, .el-tabs--right .el-tabs__active-bar.is-right {
  width: 2px;
}
.utils-alert { 
  width: 280px;
}
.utils-confirm { 
  width: 280px;
}
</style>

<script>
import HeaderPC from '@/views/Header';
import FooterPC from '@/views/Footer';
import HeaderMobile from '@/views/m/Header';
import FooterMobile from '@/views/m/Footer';

import { mapState, mapGetters, mapActions } from 'vuex';

// import APIs from '@/apis';

export default {
  name: 'App',
  metaInfo: {
    meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      charset: 'utf-8' // unuserful
    }],
    title: 'Dashboard',
    titleTemplate: '%s | Ethereum Platform'
  },
  components: {
    'header-pc': HeaderPC,
    'footer-pc': FooterPC,
    'header-m': HeaderMobile,
    'footer-m': FooterMobile
  },
  data() {
    return {
      activeIndex: '1',
      login: false,
      // device: 'pc',
      resizeFlag: null,
      reload: false
    };
  },
  // props: {
  // },
  computed: {
    // ...mapState({
    //   logColor: state => state.logColor.app,
    //   device: state => state.device.device
    // })
    ...mapState('logColor', {
      logColor: state => state.app
    }),
    // ...mapState('device', ['device'])
    ...mapGetters('device', ['device'])
  },
  provide() {
    return {
      reloadApp: this.reloadApp
    };
  },
  beforeCreate() {
    let vm = this;
    if (process.env.NODE_ENV === 'production') {
      let mobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      if (mobile) {
        // window.location.href = 'http://localhost/m/';
      }
    } else {
      window.addEventListener('resize', () => {
        if (vm.resizeFlag) {
          clearTimeout(vm.resizeFlag);
        }
        vm.resizeFlag = setTimeout(() => {
          console.log('%c[App]resize()', `color:${vm.logColor}`);
          console.log('%c[App]documentElement: (w=%d, h=%d)', `color:${vm.logColor}`,
            document.documentElement.clientWidth,
            document.documentElement.clientHeight);
          console.log('%c[App]body: (w=%d, h=%d)', `color:${vm.logColor}`,
            document.body.clientWidth,
            document.body.clientHeight);
          console.log('%c[App]screen: (w=%d, h=%d)', `color:${vm.logColor}`,
            window.screen.width,
            window.screen.height);
          vm.resizeFlag = null;
          vm.updateDevice();
        }, 100);
      });
    }
  },
  created() {
    // if (process.env.NODE_ENV !== 'production') {
    this.updateDevice();
    // }
    // window.addEventListener('hashchange', () => {
    //   console.log('[app]hashchange');
    //   // this.$router.go(0);
    // }, false);
    // window.addEventListener('popstate', () => {
    //   console.log('[app]popstate');
    //   // this.$router.go(0);
    // }, false);
    // APIs.ethereum.wallet.addListener(this);
    // APIs.ethereum.wallet.enable();
  },
  mounted() {
    console.log('%c[App]mounted()', `color:${this.logColor}`);
  },
  destroyed() {
    console.log('%c[App]destroyed()', `color:${this.logColor}`);
  },
  updated() {
    console.log('%c[App]updated()', `color:${this.logColor}`);
    let activeIndex = '0';
    if (window.location.href.indexOf('/admin') !== -1) {
      activeIndex = '99';
    } else if (window.location.href.indexOf('/home') !== -1) {
      activeIndex = '1';
    } else if (window.location.href.indexOf('/insurance') !== -1) {
      activeIndex = '21';
    } else if (window.location.href.indexOf('/analytics') !== -1) {
      activeIndex = '22';
    } else if (window.location.href.indexOf('/whitePaper') !== -1) {
      activeIndex = '3';
    } else if (window.location.href.indexOf('/faq') !== -1) {
      activeIndex = '4';
    } else if (window.location.href.indexOf('/login') !== -1) {
      activeIndex = '5';
    } else if (window.location.href.indexOf('/signUp') !== -1) {
      activeIndex = '6';
    } else if (window.location.href.indexOf('/account/user') !== -1) {
      activeIndex = '71';
    } else {
    }

    if (this.activeIndex !== activeIndex) {
      this.activeIndex = activeIndex;
    }
  },
  methods: {
    ...mapActions('device', [
      'updateDevice'
    ]),
    reloadApp() {
      this.reload = true;
      this.$nextTick(() => {
        this.reload = false;
      });
    }
  }
};
</script>



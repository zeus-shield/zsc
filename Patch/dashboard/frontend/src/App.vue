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
  border-radius: 0px;
}
.el-button--small {
  border-radius: 0px;
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
  },
  components: {
    'header-pc': HeaderPC,
    'footer-pc': FooterPC,
    'header-m': HeaderMobile,
    'footer-m': FooterMobile
  },
  data() {
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



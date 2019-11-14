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
.el-header, .el-footer {
  padding: 0;
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
  // padding: 16px 20px;
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
.el-popper[x-placement^=top] .popper__arrow {
}
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
.el-popper[x-placement^=right] {
  margin-left:12px
}
.el-popper[x-placement^=right] .popper__arrow {
  top:50%;
  left:-6px;
  margin-bottom:3px;
  border-right-color:#EBEEF5;
  border-left-width:0
}
.el-popper[x-placement^=right] .popper__arrow::after {
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
export default {
  name: 'App',
  metaInfo: {
  },
  methods: {
  }
};
</script>



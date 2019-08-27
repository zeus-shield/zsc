<template>
  <div id="app">
    <el-container>
      <el-header v-if="device == 'pc'">
        <header-pc :activeIndex="activeIndex"></header-pc>
      </el-header>
      <header-m v-else :activeIndex="activeIndex"></header-m>
      <el-main v-if="!reload">
        <router-view></router-view>
      </el-main>
      <el-footer>
        <footer-pc v-if="device == 'pc'"></footer-pc>
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
.el-menu-item, .el-submenu__title {
  font-size: 15px;
  /*padding: 0;*/

  /*display: flex;
  justify-content: center;
  align-items: center;*/
}
</style>

<script>
</script>



<template>
  <div id="app">
    <el-container>
      <el-header v-if="device == 'pc'">
        <header-pc :activeIndex="activeIndex"></header-pc>
      </el-header>
      <header-m v-else :activeIndex="activeIndex"></header-m>
      <el-main>
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
</style>

<script>
</script>



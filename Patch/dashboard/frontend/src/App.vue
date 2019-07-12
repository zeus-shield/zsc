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

<style>
</style>

<script>
</script>



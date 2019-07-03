<template>
  <div id="app">
    <el-container>
      <el-header v-if="device == 'pc'">
        <header-pc :activeIndex="activeIndex"></header-pc>
      </el-header>
      <header-m v-else :activeIndex="activeIndex"></header-m>
    </el-container>
  </div>
</template>

<style>
</style>

<script>
</script>



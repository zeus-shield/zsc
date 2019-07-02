<template>
  <div id="app">
    <el-container>
      <el-header v-if="device == 'pc'">
        <header-pc :activeIndex="activeIndex"></header-pc>
      </el-header>
    </el-container>
  </div>
</template>

<style>
</style>

<script>
</script>



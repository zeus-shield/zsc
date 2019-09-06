<template>
  <div class="header">
    <div class="header-top">
      <i class="el-icon-tickets header-logo" @click="hide = !hide"></i>
      <span class="header-title">Dashboard</span>
    </div>
    <el-collapse-transition>
      <el-menu v-if="!hide" class="header-memu" mode="vertical" :default-active="activeIndex">
      </el-menu>
    </el-collapse-transition>
  </div>
</template>

<style lang="scss" scoped>
.header-top {
}
</style>

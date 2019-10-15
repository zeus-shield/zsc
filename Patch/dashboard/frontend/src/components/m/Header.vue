<template>
  <div class="header">
    <div class="header-top">
      <i class="el-icon-tickets header-logo" @click="hide = !hide"></i>
      <span class="header-title">Dashboard</span>
    </div>
    <el-collapse-transition>
      <el-menu v-if="!hide" class="header-memu" mode="vertical" :default-active="activeIndex">
        <el-menu-item class="header-item" index="1">
          <i class="el-icon-location"></i>
          <router-link tag="span" to="/home">Ê×Ò³</router-link>
        </el-menu-item>
        <el-menu-item class="header-item" index="4" @click="switchLang()">
        </el-menu-item>
      </el-menu>
    </el-collapse-transition>
  </div>
</template>

<style lang="scss" scoped>
.header-top {
   background-color: #545c64;
}
.header-logo {
  font-size: 40px;
  color: #808080;
  margin: 10px;
}
.header-title {
}
.header-item {
  font-size: 20px;
}
</style>

<script>
import { mapState } from 'vuex';

export default {
};
</script>
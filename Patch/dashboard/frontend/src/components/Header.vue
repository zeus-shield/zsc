<template>
  <div class="header">
    <el-row class="header-menu" :gutter="0">

      <!-- logo -->
      <el-col :xs="{span: 4}" :sm="{span: 4}" :md="{span: 4}" :lg="{span: 4}">
        <div class="header-logo">
          <!-- TODO -->
          <img src="../assets/images/logo.png" style="height: 50px;">
          <img src="../assets/images/dashboard.png" style="height: 100px; margin-top: 3px;">
        </div>
      </el-col>

      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}">
        <el-menu
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">

          <!-- home -->
          <el-menu-item index="1">
            <!-- <router-link tag="span" to="/home">{{langSet[lang].header.home}}</router-link> -->
            {{langSet.header.home}}
          </el-menu-item>

          <!-- insurance -->
          <el-submenu index="2">
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
</style>

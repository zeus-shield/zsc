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
          :default-active="activeIndex"
          @select="handleSelect"
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
            <template slot="title">
              {{langSet.header.insurance}}
            </template>
            <el-menu-item index="21">
              <!-- <router-link tag="span" to="/insurance">{{langSet[lang].header.insurance}}</router-link> -->
              {{langSet.header.insurance}}
            </el-menu-item>
            <el-menu-item index="22">
              <!-- <router-link tag="span" to="/analytics">{{langSet[lang].header.analytics}}</router-link> -->
              {{langSet.header.analytics}}
            </el-menu-item>
          </el-submenu>

          <!-- white paper -->
          <el-menu-item index="3">
            {{langSet.header.whitePaper}}
          </el-menu-item>

          <!-- faq -->
          <el-menu-item index="4" >
            <!-- <router-link tag="span" to="/faq">{{langSet[lang].header.faq}}</router-link> -->
            {{langSet.header.faq}}
          </el-menu-item>

        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
</style>

<template>
  <div>
    <el-menu 
        :default-active="activeIndex" 
        class="el-menu-demo" 
        mode="horizontal"
        background-color="#545c64" 
        @select="handleSelect" 
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" v-if="!isphone">{{language.header.p1}}</el-menu-item>
        <el-menu-item index="2" v-if="!isphone">{{language.header.p2}}</el-menu-item>
        <el-menu-item index="3" v-if="!isphone">{{language.header.p3}}</el-menu-item>
        <el-menu-item index="4" v-if="!isphone">{{language.header.p4}}</el-menu-item>
        <el-menu-item index="5" v-if="!isphone&&isLogin">{{language.header.p5}}</el-menu-item>
        <el-menu-item index="6" v-if="!isphone&&!isLogin">{{language.header.p6}}</el-menu-item>
        <el-menu-item index="7" v-if="!isphone">{{language.header.p7}}</el-menu-item></router-link>
        <el-menu-item index="8" v-if="!isphone" @click="changeLanguage()">{{language.header.p8}}</el-menu-item>
        <!-- <el-submenu index="7" v-if="!isphone">
          <template slot="title">语言</template>
            <el-menu-item @click="changeLanguage()" index="7-1">中文</el-menu-item>
            <el-menu-item @click="changeLanguage()" index="7-2">英文</el-menu-item>
        </el-submenu> -->

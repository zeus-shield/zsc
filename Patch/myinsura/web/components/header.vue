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

        <div style="height:56px">
        <i v-if="isphone" class="el-icon-tickets" style="font-size:40px;color:#808080;margin-left:20px;margin-top:8px;" @click="switchHeader()"></i>
        <span class="head-icon">Myinsura</span>
        </div>
        <el-collapse-transition>
          <div v-show="isPhoneOn" style="text-align:center">
          <el-menu-item class="head-item"  index="1">{{language.header.p1}}</el-menu-item>
          <el-menu-item class="head-item" index="2">{{language.header.p2}}</el-menu-item>
          <el-menu-item class="head-item" index="3">{{language.header.p3}}</el-menu-item>
          <el-menu-item class="head-item"  index="4">{{language.header.p4}}</el-menu-item>
          <el-menu-item class="head-item"  index="5" v-if="isLogin">{{language.header.p5}}</el-menu-item>
          <el-menu-item class="head-item"  index="6" v-if="!isLogin">{{language.header.p6}}</el-menu-item>
          <el-menu-item class="head-item" index="7" >{{language.header.p7}}</el-menu-item>
          <el-menu-item class="head-item" index="8" @click="changeLanguage()">{{language.header.p8}}</el-menu-item>
          <!-- <el-submenu index="8">
          <template slot="title">语言</template>
            <el-menu-item @click="changeLanguage()" class="head-item" index="7-1">中文</el-menu-item>
            <el-menu-item @click="changeLanguage()" class="head-item" index="7-2">英文</el-menu-item>
        </el-submenu> -->
        </div>
        </el-collapse-transition>
    </el-menu>
  </div>
</template>

<script>
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';

export default {
  inject:['reload'],
  data() {
    return {
      isPhoneOn:false,
      activeIndex:"1",
      screenWidth: document.body.clientWidth,
      isphone: true,
      isLogin:false,
      language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
    };
  },
  methods: {
    switchHeader: function() {
      if(this.isPhoneOn == false) {
        this.isPhoneOn = true;

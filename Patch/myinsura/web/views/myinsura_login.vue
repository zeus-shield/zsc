<template>
<div class="page-body">
  <div v-loading.fullscreen.lock="loading" :element-loading-text="!this.isRegister?language.loading.p5:language.loading.p6" element-loading-spinner="el-icon-loading">
    <el-row :gutter="40">
      <el-col :span="22" :offset="1" :md=" {span: 8, offset: 8}" :sm=" {span: 14, offset: 5}">
        <div v-if="!isRegister">
          <el-card class="box-card" shadow="hover"> 
            <div class="card-title">
              <span>{{language.login.login}}</span>

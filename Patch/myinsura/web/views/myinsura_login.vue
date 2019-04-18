<template>
<div class="page-body">
  <div v-loading.fullscreen.lock="loading" :element-loading-text="!this.isRegister?language.loading.p5:language.loading.p6" element-loading-spinner="el-icon-loading">
    <el-row :gutter="40">
      <el-col :span="22" :offset="1" :md=" {span: 8, offset: 8}" :sm=" {span: 14, offset: 5}">
        <div v-if="!isRegister">
          <el-card class="box-card" shadow="hover"> 
            <div class="card-title">
              <span>{{language.login.login}}</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <div>
                <el-form-item :label="language.login.p1" prop="code">
                  <el-input v-model="form.code" :placeholder="language.login.p4"></el-input>
                </el-form-item>
                <el-form-item :label="language.login.p2" prop="password">
                  <el-input v-model="form.password" show-password></el-input>
                </el-form-item>

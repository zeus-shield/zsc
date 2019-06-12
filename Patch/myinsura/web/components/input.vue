<template>
<div v-loading.fullscreen.lock="loading" :element-loading-text="isInput?language.loading.p1:language.loading.p2 " element-loading-spinner="el-icon-loading" >
  <el-dialog :title="title" :visible.sync="dialogFormVisible" center :width="dialogWidth">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <div v-for="(item,key) in policyTemArray" :key="key">
        <el-form-item v-if="item == '投保人'" :label="language.input.p1" prop="投保人">
            <el-input v-model="form.投保人"></el-input>
        </el-form-item>

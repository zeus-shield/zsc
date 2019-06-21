<template>
<div v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p9" element-loading-spinner="el-icon-loading">
  <el-dialog :title="language.integralTransfer.title" :visible.sync="dialogFormVisible" center :width="dialogWidth">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <div>
        <el-form-item :label="language.integralTransfer.p1" prop="code">
          <el-input v-model="form.code" :placeholder="language.integralTransfer.p3"></el-input>
        </el-form-item>

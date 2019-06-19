<template>
<div v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p3" element-loading-spinner="el-icon-loading">
  <el-dialog :title="language.integralTrace.title" :visible.sync="dialogFormVisible" center :width="dialogWidth">

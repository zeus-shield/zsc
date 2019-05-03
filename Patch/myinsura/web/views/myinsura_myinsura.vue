<template>
<div class="page-body">
    <el-tabs v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p2" element-loading-spinner="el-icon-loading" v-model="activeName" type="card" @tab-click="handleClick" >
        <el-tab-pane :key="tabitem.name" v-for="(tabitem,tabkey) in companyListShow" :label="generateCompany(tabitem.title)" :id="tabitem.name">
            <div>

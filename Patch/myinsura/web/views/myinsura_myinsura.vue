<template>
<div class="page-body">
    <el-tabs v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p2" element-loading-spinner="el-icon-loading" v-model="activeName" type="card" @tab-click="handleClick" >
        <el-tab-pane :key="tabitem.name" v-for="(tabitem,tabkey) in companyListShow" :label="generateCompany(tabitem.title)" :id="tabitem.name">
            <div>
                <el-row :gutter="50" >
                    <el-col :span="24" :sm="12" :md="8" v-for="(item) in policyListShow[tabkey]" :key="item" :id="item">
                        <div class="square-card" >
                            <router-link :to="`/info/${focusCompany}_${item}`">
                                <div class="square-card-image">

<template>
    <div class="page-body">
        <div>
        <el-row :gutter="40">
                <el-col :span="24">
                    <div class="up-card">
                        <div class="up-card-title">
                            <span>{{policyinfo.title}}</span>
                        </div>
                        <div class="up-card-page" v-for="(item,key) in policyinfo.content" :key="key" >
                            <el-card class="box-card" shadow="hover">
                                <div class="up-card-page-title">
                                    <span>{{item.title}}</span>
                                </div>
                                <div class="up-card-page-item" v-for="(dataItem) in item.data" :key="dataItem">
                                    <span>{{dataItem}}</span>

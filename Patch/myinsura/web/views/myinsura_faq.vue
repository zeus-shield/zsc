<template>
<div class="page-body">
    <el-row :gutter="40">
        <el-col :span="24">    
            <div style="font-size:40px;font:'PingFang SC';color:black;">
                {{language.FAQ.title}}
            </div>
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item name="1">
                    <template slot="title">
                    <span class="FAQ-title">{{language.FAQ.question1}}</span>&nbsp;&nbsp;<i class="header-icon el-icon-info"></i>

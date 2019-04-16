<template>
<div class="page-body">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="status == 0 ? '个人信息载入中':(status == 1?'用户签到处理中':(status == 2? '积分赠送处理中':(status == 3?'积分查询处理中':'积分加载中')))">
       <el-row :gutter="40">
            <el-col :span="24" :md="8">
                <div class="left-card" >
                    <div class="card-title">
                        <span>{{code}}</span>
                    </div>

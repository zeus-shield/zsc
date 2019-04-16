<template>
<div class="page-body">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="status == 0 ? '个人信息载入中':(status == 1?'用户签到处理中':(status == 2? '积分赠送处理中':(status == 3?'积分查询处理中':'积分加载中')))">
       <el-row :gutter="40">
            <el-col :span="24" :md="8">
                <div class="left-card" >
                    <div class="card-title">
                        <span>{{code}}</span>
                    </div>
                    <div class="left-card-integral">
                        <span>积分</span>
                        <span>{{integralBalance}}</span>
                    </div>
                    <div class="left-card-integral-operation">
                        <div class="left-card-integral-operation-block">
                            <button class="left-button" @click="userCheckIn()">签到</button>
                        </div>
                        <div class="left-card-integral-operation-block">
                            <button class="left-button" @click="transfer()">赠送</button>
                        </div>
                        <div class="left-card-integral-operation-block">
                            <button class="left-button" @click="trace()">查询</button>
                        </div>
                    </div>
                </div>

                <div  class="left-card" v-if="isTimeLineLoaded">
                    <div class="card-icon">
                        <i :class="!timeLineShow?'el-icon-arrow-down':'el-icon-arrow-up'" @click="hiddenTimeLine()"></i>
                    </div>
                    <div class="card-title">
                        <span>积分记录</span>
                    </div>
                    <div class="card-time">
                        <span >{{startTime}} - {{endTime}}</span>
                    </div>
                    <el-timeline :reverse="reverse" style="margin-left:10%;margin-top:10px" v-if="timeLineShow">
                        <el-timeline-item    v-for="(activity, index) in activities"
                                            :key="index"
                                            :timestamp="activity.timestamp">
                                            {{activity.content}}
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-col>

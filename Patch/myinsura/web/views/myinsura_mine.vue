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

            <el-col :span="24" :md="16">
                <div class="right-card">
                    <div v-if="userAllPolicy!=[]" style="margin:10px">
                        <div class="card-title">
                            <span>我的保单</span>
                        </div>
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item v-for="(policy,key) in userAllPolicy" :title="policy.name" :name="key" :key="key">
                                <div class="right-card-policyInfo" v-for="(value,info) in policy.value" :key="info">
                                    <div v-if="info == 'Hash'">
                                        <div class="right-card-policyInfo-left">{{info}}</div>
                                        <div class="right-card-policyInfo-right">
                                            <a target="_blank" :href='getUrl(value)'>{{value.slice(0,12)}}...{{value.slice(-12)}}</a>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="right-card-policyInfo-left">{{info}}</div>
                                        <div class="right-card-policyInfo-right">{{value}}</div>
                                    </div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                    <div v-else>
                        <div class="card-title">
                            <span>您没有保单</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import {getUserPolicies,getPolicyInfo,userLogin,getIntegralBalance,userCheckIn,integralTransfer} from '../api/api'
import api from '../common/api'

import Insurance from '../api/insurance.js';
import ContractInfo from '../api/ContractInfo';
import Encrypt from '../api/encrypt';

const insuranceAbi = ContractInfo.insuranceAbi;
const insuranceAddress = ContractInfo.insuranceAddress;

export default {
    data() {
        var checkCode = (rule, value, callback) => {
            if (/^1[34578]\d{9}$/.test(value)) {
                callback();
            } else if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)){
                callback(new Error('请输入正确的手机号或邮箱地址'));
            } else {
                callback(new Error('请输入正确的手机号或邮箱地址'));
            }
        };

        return {
            loading:false,
            activeName: '1',
            isGet:[],
            userAllPolicytemp:[],
            isHashHidden:[],
            userAllPolicy:[],
            userAllPolicyHiddenValue:[],

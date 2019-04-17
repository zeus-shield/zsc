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

            islogin:false,
            code:"登录后查看积分",
            
            integralBalance:"0",

            isloadingOK:[],
            timeLineShow:false,
            reverse: false,
            activities: [],
            isTimeLineLoaded:false,
            startTime:"",
            endTime:"",
            status:0,   //0:保单载入，1:签到，2：赠送，3：查询，4:积分加载

        };
    },
    methods: {
        //获取用户所有保单
        getUserPolicies:function () {
            let handler = this;
            //let userKey = "ddroyce@163.com";
            let userKey = handler.code;
            userKey = Encrypt.encryptCode(userKey);
            let insurance = new Insurance(insuranceAbi,insuranceAddress);
            insurance.userGetPolicies(userKey,function(error, result) {
                if(error) {
                    res.json({
                        status:"error",
                        code:"-9",
                        msg:"交易报错",
                        error:error.toString(10)
                    })
                } else {
                    if(result[0] == -3 || result[0] == -1) {//判断状态值//inner error
                        handler.checkisLoadingOk(0);
                        if(handler.islogin == false) {
                            handler.$message({
                                message: '登录后可查看保单',
                                type: 'warning'
                            });
                        } else {
                            handler.$message({
                                message: '信息查询有误，请联系管理员',
                                type: 'warning'
                            });
                        }
                    } else if (result[0] == -2) {//no data
                        handler.checkisLoadingOk(0);
                        handler.$message({
                            message: '用户没有保单',
                            type: 'warning'
                        }); 
                    }  else if (result[0] == 0) {//success
                        let userPolicy = result[1].split(",");
                        for (var i in userPolicy) {
                            handler.isGet.push(false);
                        }
                        let isHashhiddentemp = [];
                        for (var i in userPolicy) {
                            let temp = userPolicy[i].substr(43, userPolicy[i].length).split("_");
                            handler.userAllPolicytemp.push({
                                name: temp[0] + "公司" + temp[1],
                                key: userPolicy[i],
                                value: {}
                            });
                            handler.isHashHidden.push(false);
                        }
                        for (let i = 0; i < handler.userAllPolicytemp.length; i++) {
                            handler.getPolicyInfo(i);
                        }
                    }
                }
            })
        },

        //获取特定保单的所有信息
        getPolicyInfo: function (i) {
            let handler = this;
            //let key = "ddroyce@163.com_PingAn_Life";
            let key = handler.userAllPolicytemp[i].key;
            let insurance = new Insurance(insuranceAbi,insuranceAddress);
            insurance.policyGetByKey(0,key,function(error, result) {
                if(error) {
                    handler.getPolicyInfo(i);
                } else {
                    if(result[0] == -3 || result[0] == -1 || result[0] == -2) {//判断状态值//inner error
                        handler.checkisLoadingOk(0);
                        handler.$message({
                            message: '信息查询有误，请联系管理员',
                            type: 'warning'
                        });
                    }  else if (result[0] == 0) {//success
                        let temp = JSON.parse(result[1]);
                        delete temp.Size;
                        delete temp.Key;
                        delete temp.UserKey;
                        handler.userAllPolicytemp[i].value = temp
                        handler.isGet[i] = true;

                        if(handler.check() == true) {
                            for (let i = 0; i < handler.userAllPolicytemp.length; i++) {
                                handler.userAllPolicyHiddenValue.push(true);
                            }
                            handler.userAllPolicy = handler.userAllPolicytemp;
                            handler.checkisLoadingOk(0);
                        }
                    }
                }
            })
        },
        

        //检查是否获取保单信息
        check: function() {
            for(let i = 0; i < this.isGet.length; i++) {
                if(this.isGet[i] == false) {
                    return false;
                }
            }
            return true;
        },

        //获取用户积分余额
        getIntegralBalance: function () {
            let handler = this;
            let owner = handler.code;
            owner = Encrypt.encryptCode(owner);

            let insurance = new Insurance(insuranceAbi,insuranceAddress);
            insurance.integralBalanceOf(owner,function(error, result) {
                if(error) {
                    handler.$message({
                        message: '区块链服务有误，请联系管理员',
                        type: 'warning'
                    });
                    handler.checkisLoadingOk(1);
                } else {
                    handler.integralBalance = parseInt(result);
                    window.sessionStorage.setItem("Integral",handler.integralBalance);
                    handler.checkisLoadingOk(1);
                }
            })
        },

        //用户签到
        userCheckIn: function() {
            let handler = this;
            handler.status = 1;
            handler.loading = true; 
            let para = [];
            para.push(`Owner=${handler.code}`)
            userCheckIn(para.join("&"))
            .then((res) => {
                if (res.code == "-6") {//交易失败 
                    handler.status = 0;
                    handler.loading = false; 
                    this.$message({
                        message: '签到失败，请稍后再试或联系管理员',
                        type: 'warning'
                    });
                } else if (res.code == "0") {//交易成功
                    handler.status = 0;
                    handler.loading = false; 
                    this.$message({
                        message: '签到成功',
                    });
                    window.location.href="/mine";
                } else if (res.code == "-9") {//交易报错
                    handler.status = 0;
                    handler.loading = false; 
                    this.$message({
                        message: '今天已签到',
                        type: 'warning'
                    });
                }
            })
            .catch((error) => {
                this.$message({
                    message: '网络波动，请稍后刷新重试',
                    type: 'warning'
                });
                this.status = 0;
                this.loading = false;
                console.log(error);
            })
        },

        //弹出赠送对话框
        transfer:function(){
            this.$router.push({path: this.$route.path,query: {transfer: 'true'}});
        },

        //弹出查询时间对话框
        trace: function(){
          this.$router.push({path: this.$route.path,query: {trace: 'true'}});
        },

        //检查积分和保单是否都获取成功
        checkisLoadingOk: function (int) {
            this.isloadingOK[int] = true;
            let temp = true;
            for(var key in this.isloadingOK) {
                if(this.isloadingOK[key] == false){
                    temp = false;
                }
            }
            if(temp == true) {
                this.status = 0;
                this.loading = false;
            }
        },

        //获取积分记录
        integralTrace: function(startTime,endTime){
            let handler = this;
            let key = Encrypt.encryptCode(handler.code);
            let insurance = new Insurance(insuranceAbi,insuranceAddress);
            insurance.integralTrace(key,startTime,endTime,function(error, result) {
                if(error) {
                    handler.$message({
                        message: '区块链服务有误，请联系管理员或稍后查询',
                        type: 'warning'
                    });
                    handler.status = 0;
                    handler.loading = false;
                } else {
                    handler.startTime = handler.timestampToStringNotime(startTime);
                    handler.endTime = handler.timestampToStringNotime(endTime);
                    window.sessionStorage.setItem("StartTime","2");
                    window.sessionStorage.setItem("EndTime","2");
                    handler.showTimeLine(result);
                }
            })
        },

        //显示积分记录
        showTimeLine: function(data) {
            let handler = this;
            handler.activities = [];
            data = JSON.parse(data)
            for (var key in data.list) {
                if(data.list[key].scene != undefined) {
                    if(data.list[key].scene == 0) {//用户注册
                        handler.activities.push({
                            content:"注册获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })

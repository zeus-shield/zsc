<template>
<div class="page-body">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="status == 0 ? language.loading.p7:(status == 1?language.loading.p8:(status == 2? language.loading.p9:(status == 3?language.loading.p10:language.loading.p11)))">
       <el-row :gutter="40">
            <el-col :span="24" :md="8">
                <div class="left-card" >
                    <div class="card-title">
                        <span>{{code}}</span>
                    </div>
                    <div class="left-card-integral">
                        <span>{{language.mine.integral.title}}</span>
                        <span>{{integralBalance}}</span>
                    </div>
                    <div class="left-card-integral-operation">
                        <div class="left-card-integral-operation-block">
                            <button class="left-button" @click="userCheckIn()">{{language.mine.integral.button1}}</button>
                        </div>
                        <div class="left-card-integral-operation-block">
                            <button class="left-button" @click="transfer()">{{language.mine.integral.button2}}</button>
                        </div>
                        <div class="left-card-integral-operation-block">
                            <button class="left-button" @click="trace()">{{language.mine.integral.button3}}</button>
                        </div>
                    </div>
                </div>

                <div  class="left-card" v-if="isTimeLineLoaded">
                    <div class="card-icon">
                        <i :class="!timeLineShow?'el-icon-arrow-down':'el-icon-arrow-up'" @click="hiddenTimeLine()"></i>
                    </div>
                    <div class="card-title">
                        <span>{{language.mine.integralLine.title}}</span>
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
                        <div class="card-title" style="line-height:40px">
                            <span>{{language.mine.policy.title}}</span>
                        </div>
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item v-for="(policy,key) in userAllPolicy"  :name="key" :key="key">
                                <template slot="title">
                                    <span style="line-height:13px">{{policy.name}}</span>
                                </template>
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
                            <span>{{language.mine.policy.nopolicy}}</span>
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
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';
import policyInfo from '../api/policyInfo.js'
import policyInfo_EN from '../api/policyInfo-en.js'

import Insurance from '../api/insurance.js';
import ContractInfo from '../api/ContractInfo';
import Encrypt from '../api/encrypt';

const insuranceAbi = ContractInfo.insuranceAbi;
const insuranceAddress = ContractInfo.insuranceAddress;

export default {
    data() {
        return {
            loading:false,
            activeName: '1',
            isGet:[],
            userAllPolicytemp:[],
            isHashHidden:[],
            userAllPolicy:[],
            userAllPolicyHiddenValue:[],

            islogin:false,
            code:api.getCookie('language') == 'en' ? "Check the point after login" : "登录后查看积分",
            
            integralBalance:"0",

            isloadingOK:[],
            timeLineShow:false,
            reverse: false,
            activities: [],
            isTimeLineLoaded:false,
            startTime:"",
            endTime:"",
            status:0,   //0:保单载入，1:签到，2：赠送，3：查询，4:积分加载
            language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
             companyListCNToEN:{
                中国人保:"PICC",
                中国平安:"PING AN",
                中国太平洋:"CPIC",
                中国人寿:"CHINA LIFE",
                新华保险:"NCI",
            },
            policyKeyCNToEN:{
                投保人:"Applicant",
                被保人:"Insured",
                保障额度:"Amount",
                保单编号:"Number",
                保障期限:"Period",
                车牌号:"Car No.",
                车龄:"Car Age",
                开始时间:"StartTime",
                结束时间:"EndTime",
                自动续保:"Renewal",
                有无社保:"Guarantee",
                有无交通事故:"Accident",
                缴费方式:"Payment",
                按年缴费:"Premium paid each year",
                按月缴费:"premium paid each month",
                描述:"Description",
                Hash:"Hash"
            },

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
                                message: handler.language.message.needlogin2,
                                type: 'warning'
                            });
                        } else {
                            handler.$message({
                                message: handler.language.message.dataError,
                                type: 'warning'
                            });
                        }
                    } else if (result[0] == -2) {//no data
                        handler.checkisLoadingOk(0);
                        handler.$message({
                            message: handler.language.message.noPolicy,
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
                            let policyName = handler.generatePolicyName(temp)
                            handler.userAllPolicytemp.push({
                                name: policyName,
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
                            message: handler.language.message.dataError,
                            type: 'warning'
                        });
                    }  else if (result[0] == 0) {//success
                        let temp = JSON.parse(result[1]);
                        delete temp.Size;
                        delete temp.Key;
                        delete temp.UserKey;
                        for(var key in temp) {
                            if(key == "保障额度") {
                                temp[key] += "RMB";
                            } else if(key == "保障期限" || key == "车龄") {
                                temp[key] += api.getCookie('language') == 'en' ? " years" : " 年";
                            } else if(key == "自动续保") {
                                if(api.getCookie('language') == 'en') {
                                    if(temp[key] == "不自动续保") {
                                        temp[key] = "No"
                                    } else {
                                        temp[key] = "Yes"
                                    }
                                }
                            } else if(key == "有无社保（投保人）") {
                                if(api.getCookie('language') == 'en') {
                                    if(temp[key] == "无社保") {
                                        temp[key] = "No"
                                    } else {
                                        temp[key] = "Yes"
                                    }
                                }
                            } else if(key == "有无交通事故") {
                                if(api.getCookie('language') == 'en') {
                                    if(temp[key] == "无交通事故") {
                                        temp[key] = "No"
                                    } else {
                                        temp[key] = "Yes"
                                    }
                                }
                            } else if(key == "缴费方式") {
                                if(api.getCookie('language') == 'en') {
                                    if(temp[key] == "按年缴费") {
                                        temp[key] = "Year pay"
                                    } else {
                                        temp[key] = "Month pay"
                                    }
                                }
                            }
                        }
                        for(var key in temp) {
                            if(api.getCookie('language') == 'en') {
                                if(key == "有无社保（被保人）"){
                                    let valTemp = temp[key];
                                    delete temp[key];
                                    temp[handler.policyKeyCNToEN.有无社保] = valTemp;
                                } else {
                                    let valTemp = temp[key];
                                    delete temp[key];
                                    temp[handler.policyKeyCNToEN[key]] = valTemp;
                                }
                            }
                        }
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
                        message: handler.language.message.trackError,
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
                        message: handler.language.message.checkInFail,
                        type: 'warning'
                    });
                } else if (res.code == "0") {//交易成功
                    handler.status = 0;
                    handler.loading = false; 
                    this.$message({
                        message: handler.language.message.checkInSuccess,
                    });
                    window.location.href="/mine";
                } else if (res.code == "-9") {//交易报错
                    handler.status = 0;
                    handler.loading = false; 
                    this.$message({
                        message: handler.language.message.trackError,
                        type: 'warning'
                    });
                }
            })
            .catch((error) => {
                this.$message({
                    message: handler.language.message.postError,
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
                        message: handler.language.message.trackError,
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
                if(data.list[key].scene != undefined && api.getCookie('language') != 'en') {
                    if(data.list[key].scene == 0) {//用户注册
                        handler.activities.push({
                            content:"注册获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 1) {//提交保单上链
                        handler.activities.push({
                            content:"提交保单上链获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 2) {//签到
                        handler.activities.push({
                            content:"签到获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 3) {//邀请其他用户
                        handler.activities.push({
                            content:"邀请其他用户获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 4) {//分享至微信
                        handler.activities.push({
                            content:"分享至微信获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 5) {//分享至QQ
                        handler.activities.push({
                            content:"分享至QQ获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 6) {//分享至微博
                        handler.activities.push({
                            content:"分享至微博获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 7) {//点击广告
                        handler.activities.push({
                            content:"点击广告获得"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 8) {//管理员奖励
                        handler.activities.push({
                            content:"管理员发送"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 9) {//使用积分
                        handler.activities.push({
                            content:"使用积分消耗"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 10) {//积分赠送
                        handler.activities.push({
                            content:"赠送其他用户"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 11) {//积分接受赠送
                        handler.activities.push({
                            content:"获得其他用户赠送的"+data.list[key].value+"积分",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else {
                        console.log(data.list[key]);
                    }
                } else {
                     if(data.list[key].scene == 0) {//用户注册
                        handler.activities.push({
                            content:"Sign up for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 1) {//提交保单上链
                        handler.activities.push({
                            content:"Submit policy for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 2) {//签到
                        handler.activities.push({
                            content:"Sign in for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 3) {//邀请其他用户
                        handler.activities.push({
                            content:"Invite others for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 4) {//分享至微信
                        handler.activities.push({
                            content:"Share to wechat for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 5) {//分享至QQ
                        handler.activities.push({
                            content:"Share to QQ for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 6) {//分享至微博
                        handler.activities.push({
                            content:"Share to weibo for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 7) {//点击广告
                        handler.activities.push({
                            content:"Click advertisement for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 8) {//管理员奖励
                        handler.activities.push({
                            content:"System gift for "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 9) {//使用积分
                        handler.activities.push({
                            content:"Consume "+data.list[key].value+" integrals.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 10) {//积分赠送
                        handler.activities.push({
                            content:"Send "+data.list[key].value+" integrals to others.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else if (data.list[key].scene == 11) {//积分接受赠送
                        handler.activities.push({
                            content:"Recieve "+data.list[key].value+" integrals from others.",
                            timestamp:handler.timestampToString(data.list[key].time)
                        })
                    } else {
                        console.log(data.list[key]);
                    }
                }
            }

            handler.timeLineShow = true;
            handler.isTimeLineLoaded = true;
            handler.status = 0;
            handler.loading = false;
        },

        //时间戳转特定字符串
        timestampToStringNotime: function(int) {
            return new Date(parseInt(int) * 1000).toLocaleString().slice(0,9).replace(/:\d{1,2}$/,' ');
        },

        timestampToString: function(int){
            var time = new Date((int - 28800)*1000);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        },

        add0: function(m){
            return m<10?'0'+m:m 
        },

        //积分记录的显示/隐藏
        hiddenTimeLine: function() {
            if(this.timeLineShow == false) {
                this.timeLineShow = true;
            } else {
                this.timeLineShow = false;
            }
        },

        getTimeData: function() {
            let startTime = window.sessionStorage.getItem("StartTime");
            let endTime = window.sessionStorage.getItem("EndTime");
            if(startTime != null && startTime != "2") {
                this.timeLineShow = false;
                this.status = 3;
                this.loading = true;
                this.integralTrace(startTime,endTime) ;
            }
        },

        getUrl: function(value) {
            return `https://rinkeby.etherscan.io/tx/${value}`
        },

        generatePolicyName(array){
            if(api.getCookie('language') == 'en') {
                let policyInfoTemp = policyInfo_EN;
                let temp = "DB_Policy_"+array[0]+"_"+array[1];
                return this.companyListCNToEN[array[0]] + " - " + policyInfoTemp[temp].title.split("-")[1].slice(1)
            } else {
                return array[0] + "公司" + array[1];
            }
        },
          
        
    },
    watch: {
        "$route": "getTimeData"
    },
    mounted() {
        let temp = window.sessionStorage.getItem("isLogin");
        if(!temp|| temp == undefined || temp == null){
            this.$message({
                message: this.language.message.needlogin3,
                type: 'warning'
            });
            window.location.href="/";
        } else {
            this.status = 0;
            this.loading = true;
            this.code = api.getCookie("Code");
            this.isloadingOK.push(false);
            this.getIntegralBalance();
            this.isloadingOK.push(false);
            this.getUserPolicies();
        }
    },
    created() {
        
    },
};
</script>

<style lang="scss" scoped>
    .page-body{
        width:80%;
        margin:56px auto auto auto;
    }
   .left-card{
        border: 1px solid rgba(187, 187, 187, 1);
        margin-bottom:20px;
        color:black
    }
  
   .right-card{
        border: 1px solid rgba(187, 187, 187, 1);
        margin-bottom:10px;
        color:black
    } 

    .card-title{
        width:100%;
        text-align:center;
        line-height:60px;
        font-size:30px
    }

    .card-time{
        width:100%;
        height:30px;
        text-align:center;
        line-height:30px;
        font-size:15px
    }
    .card-icon{
        width:100%;
        height:20px;
        text-align:center;
        line-height:40px;
        font-size:30px
    }
    .left-card-integral{
        width:100%;
        height:60px;
        text-align:center;
        line-height:40px;
        font-size:20px
    }
    .left-card-integral-operation{
        width:100%;
        height:20px;
        text-align:center;
        line-height:40px;
        font-size:20px;
        padding-top: 0px;
        margin-bottom: 40px;
        border-top: 1px solid rgba(187, 187, 187, 1);
    }
    .left-card-integral-operation-block{
        width:33.33%;
        height:100%;
        float:left;
    }

    .right-card-policyInfo{
        height:30px;
    }
    .right-card-policyInfo-left{
        float:left;
        text-align:left
    }
    .right-card-policyInfo-right{
        float:right;
        text-align:right
    }
    .right-card-policyInfo-left-hash{
        float:left;
        text-align:left;
        font-size: 12px
    }
    .right-card-policyInfo-right-hash{
        float:right;
        text-align:right;
        font-size: 12px
    }
    @media (max-width:775px) {
        .right-card-policyInfo-right-hash{
            clear: both;
            transform-origin: right top;
            transform:scale(0.65);
        }
    }

    .left-button {
        margin:10px 0 20px 0;
        height: 40px;
        border-radius: 5px;
        background-color: rgb(102, 177, 255);
        color: white;
        font-size: 14px;
        text-align: center;
        font-family: Arial;
        border: 1px solid rgba(187, 187, 187, 1);
        width:80%;
    }
     

  
</style>

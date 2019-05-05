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
                                    <img :src="getImgUrl(item)">
                                </div>
                                <div class="square-card-page">
                                    <span>{{generatePolicy(tabitem.title,item)}}</span>
                                </div>
                            </router-link>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script>
import api from '../common/api'
import { getAllcompanyAndpolicy,companyGetByKey} from '../api/api';
import policyInfo from '../api/policyInfo.js'
import policyInfo_EN from '../api/policyInfo-en.js'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';

import Insurance_extension from '../api/insurance_extension.js';
import ContractInfo from '../api/ContractInfo';

const insuranceExAbi = ContractInfo.insuranceExAbi;
const insuranceExAddress = ContractInfo.insuranceExAddress;


export default {
    data() {
        return {
            //公司部分
            activeName: '0',
            //当前公司
            focusCompany:"",
            focusName:"",
            //公司列表
            companyList:[],
            companyListShow: [  {name:'0',title:"中国人保"},
                                {name:'1',title:"中国平安"},
                                {name:'2',title:"中国太平洋"},
                                {name:'3',title:"中国人寿"},
                                {name:'4',title:"新华保险"}],

            companyListCNToEN:{
                中国人保:"PICC",
                中国平安:"PING AN",
                中国太平洋:"CPIC",
                中国人寿:"CHINA LIFE",
                新华保险:"NCI",
            },
            //保险部分
            policyListShow:[[],[],[],[],[]],
            //data
            companyAndPolicy: {},
            loading:false,
            language:api.getCookie('language') == 'en' ? en_GB : zh_CN,
        };
    },
    methods: {
        //tab切换
        handleClick(tab, event) {
            this.focusCompany = this.companyListShow[tab.$attrs.id].title;
            this.focusName = this.companyListShow[tab.$attrs.id].name;
            if(this.policyListShow[this.focusName].length == 0){
                this.loading = true;
                this.companyGetByKey(this.focusCompany);
            }
        },

        //获取数据
        // getAllfromServer: function() {
        //     let handler = this;
        //     getAllcompanyAndpolicy()
        //     .then((res) => {
        //         if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {//交易成功没拿到值
        //             this.$message({
        //                 message: '区块链服务出错，请联系管理员',
        //                 type: 'warning'
        //             });
        //             handler.loading = false;
        //         } else if (res.data.code == "-9") {
        //             this.$message({
        //                 message: '信息获取失败，请联系管理员',
        //                 type: 'warning'
        //             });
        //             handler.loading = false;
        //         } else if (res.data.code == "0") {
        //             let temp = JSON.parse(res.data.data[1]);
        //             delete temp.Size
        //             handler.companyAndPolicy = temp;
        //             window.sessionStorage.setItem("companyAndPolicy",JSON.stringify(temp));
        //             handler.showCompanyAndPolicy();
        //         }
        //     })
        //     .catch((error) => {
        //         this.$message({
        //             message: '网络波动，请稍后刷新重试',
        //             type: 'warning'
        //         });
        //         handler.loading = false;
        //     })
        // },
            
        //渲染页面
        // showCompanyAndPolicy:function() {
        //     var handler = this;
        //     let companyList = [];
        //     let policyList = [];
        //     for (var key in handler.companyAndPolicy) {
        //         policyList.push(handler.companyAndPolicy[key].split("#"));
        //         companyList.push(key);
        //     }

        //     for( var key in companyList) {
        //         handler.companyListShow.push({title: companyList[key],name: `${key}`});
        //     }
        //     handler.policyListShow = policyList;
        //     handler.focusCompany = companyList[2];
        //     handler.loading = false;
        // },
        
        //获取特定公司的所有险种
        companyGetByKey: function(company){
            let handler = this;
            let key = company;
            let insurance_extension = new Insurance_extension(insuranceExAbi,insuranceExAddress);
            insurance_extension.companyGetByKey(key,function(error, result) {
                if(error) {
                    handler.$message({
                        message: handler.language.message.trackError,
                        type: 'warning'
                    });
                } else {
                    if(result.status == "0x0") {
                        console.log("====padding====")
                    } else {
                        if (result[0] == "-1" || result[0] == "-2" || result[0] == "-3") {//交易成功没拿到值
                            handler.$message({
                                message: handler.language.message.dataError,
                                type: 'warning'
                            });
                        }  else if (result[0] == 0) {//success
                            handler.showPolicy(result[1]);
                        }
                    }
                }
            })
        },

        showPolicy: function(data) {
            this.policyListShow[this.focusName] = data.split("#");
            window.sessionStorage.setItem("Policy",this.policyListShow.join("&"));
            this.loading = false;
        },

        generatePolicy(tabkey,str){
            if(api.getCookie('language') == 'en') {
                let policyInfoTemp = policyInfo_EN;
                let temp = "DB_Policy_"+tabkey+"_"+str;
                return policyInfoTemp[temp].title.split("-")[1].slice(1)
            } else {
                return str;
            }
        },

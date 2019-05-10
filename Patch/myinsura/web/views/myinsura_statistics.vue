<template>
<div class="page-body">
    <div v-loading.fullscreen.lock="loading" :element-loading-text="language.loading.p13" element-loading-spinner="el-icon-loading" >
    <el-row :gutter="40">
            <el-col :span="24" :md="12">
                <div class="echarts-card">
                    <div id="chartPie" class="echarts"></div>
                </div>
            </el-col>
            <el-col :span="24" :md="12">
                <div class="echarts-card">
                    <div id="chartLine" class="echarts"></div>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import {getStatisticData} from '../api/api'
import echarts from 'echarts'
import api from '../common/api'
import en_GB from '../common/language/en-GB.js';
import zh_CN from '../common/language/zh-CN.js';
import policyInfo from '../api/policyInfo.js'
import policyInfo_EN from '../api/policyInfo-en.js'

import Insurance from '../api/insurance.js';
import ContractInfo from '../api/ContractInfo';

const insuranceAbi = ContractInfo.insuranceAbi;
const insuranceAddress = ContractInfo.insuranceAddress;

export default {
    data() {
        return {
            loading:false,
            policyDatatemp:[],
            companyDatatemp:{
                title: api.getCookie('language') == 'en' ? 'The top five total input' : '总录入量前五',
                data: [],
                categories: []
            },
            chartPie:null,
            chartLine:null,
            ischartOK:[false,false],
            language:api.getCookie('language') == 'en' ? en_GB : zh_CN,

            companyListCNToEN:{
                中国人保:"PICC",
                中国平安:"PING AN",
                中国太平洋:"CPIC",
                中国人寿:"CHINA LIFE",
                新华保险:"NCI",
            },
        };
    },
    methods: {
        //获取数据
        getStatisticData: function() {
            let handler = this;
            getStatisticData()
            .then((res) => {
                if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {//交易成功没拿到值
                    handler.$message({
                        message: handler.language.message.dataError,
                        type: 'warning'
                    });
                    handler.loading = false;
                } else if (res.data.code == "-9") {
                    handler.$message({
                        message: handler.language.message.trackError,
                        type: 'warning'
                    });
                    handler.loading = false;
                } else if (res.data.code == "0") {
                    let temp = res.data.data[1].split(",");
                    window.sessionStorage.setItem("statisticData",JSON.stringify(temp))
                    handler.statisticData(temp);
                }
            })
            .catch((error) => {
                console.log(error);
                handler.$message({
                    message: handler.language.message.postError,
                    type: 'warning'
                });
                handler.loading = false;
            })
        },

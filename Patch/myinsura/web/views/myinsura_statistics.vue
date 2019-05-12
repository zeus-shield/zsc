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

        getStatisticData: function () {
            let handler = this;
            let insurance = new Insurance(insuranceAbi,insuranceAddress);
            let id = 0;
            let count = 100;
            insurance.policyGetKeys(id,count,function(error, result) {
                if(error) {
                    handler.$message({
                        message: handler.language.message.trackError,
                        type: 'warning'
                    });
                    handler.loading = false;
                } else {
                    if(result[0] == -3 || result[0] == -1 || result[0] == -2) {//判断状态值//inner error
                        handler.$message({
                            message: handler.language.message.dataError,
                            type: 'warning'
                        });
                        handler.loading = false;
                    }  else if (result[0] == 0) {//success
                        let temp = result[1].split(",");
                        window.sessionStorage.setItem("statisticData",JSON.stringify(temp))
                        handler.statisticData(temp);
                    }
                }
            })
        },


        //分析数据
        statisticData:function(data) {
            if(data){
                for (var i in data) {
                    let temp = data[i].substr(43, data[i].length).split("_");

                    let policyisfind = false;
                    for (var j in this.policyDatatemp) {
                        if (this.generatePolicy(temp[0],temp[1]) == this.policyDatatemp[j].name) {
                            this.policyDatatemp[j].value++;
                            policyisfind = true;
                        }
                    }
                    if (policyisfind == false) {
                        this.policyDatatemp.push({ value : 1 , name: this.generatePolicy(temp[0],temp[1])});
                    }

                    let companyisfind = false;
                    for (var k in this.companyDatatemp.categories) {
                        if ((temp[0]) == this.companyDatatemp.categories[k]){
                            this.companyDatatemp.data[k]++;
                            companyisfind = true;
                        }
                    }
                    if (companyisfind == false) {
                        this.companyDatatemp.categories.push(temp[0]);
                        this.companyDatatemp.data.push(1);
                    }
                }

                this.sortData();
                
            } else {
                this.$message({
                    message: handler.language.message.noData,
                    type: 'warning'
                });
                this.loading = false;
            }
        },

        //排序
        sortData:function() {
            for (var i in this.companyDatatemp.categories) {
                if(api.getCookie('language') == 'en') {
                    this.companyDatatemp.categories[i] = this.generateCompany(this.companyDatatemp.categories[i])
                }
            }
            for (let i = 0; i < this.policyDatatemp.length; i++) {
                for (let j = 0; j < this.policyDatatemp.length-i-1; j++){
                    if (this.policyDatatemp[j].data < this.policyDatatemp[j+1].data) {
                        let temp = this.policyDatatemp[j];
                        this.policyDatatemp[j] = this.policyDatatemp[j + 1];
                        this.policyDatatemp[j + 1] = temp;
                    }
                }
            };

            for (let i = 0; i < this.companyDatatemp.data.length; i++) {
                for (let j = 0; j < this.companyDatatemp.data.length - i - 1; j++) {
                    if (this.companyDatatemp.data[j] < this.companyDatatemp.data[j + 1]) {
                        let temp1 = this.companyDatatemp.data[j];
                        let temp2 = this.companyDatatemp.categories[j];
                        this.companyDatatemp.data[j] = this.companyDatatemp.data[j + 1];
                        this.companyDatatemp.categories[j] = this.companyDatatemp.categories[j + 1];
                        this.companyDatatemp.data[j + 1] = temp1;
                        this.companyDatatemp.categories[j + 1] = temp2;
                    }
                }
            };
            if (this.policyDatatemp.length>5) {
                this.policyDatatemp = this.policyDatatemp.slice(0, 5);
            }
            if (this.companyDatatemp.data.length>5) {
                this.companyDatatemp.data = this.companyDatatemp.data.slice(0, 5);
                this.companyDatatemp.categories = this.companyDatatemp.categories.slice(0, 5);
            }
            
            this.createPie();
            this.createLine();
        },

        //绘制饼图
        createPie: function() {
            this.chartPie = echarts.init(document.getElementById('chartPie'));

            let option = {
                title: {
                    text: api.getCookie('language') == 'en' ? 'Insurance ranking' : '险种排行榜',
                    left: 'center',
                    top: 10,
                    textStyle: {
                        color: '#000000',
                        fontSize :36,
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name:api.getCookie('language') == 'en' ? 'Policy :' : '险种 :',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.policyDatatemp
                    }
                ]
            };

            this.chartPie.setOption(option);
            this.ischartOK[0] = true;
            this.check();
        },

        //绘制柱状图
        createLine: function() {
            this.chartLine = echarts.init(document.getElementById('chartLine'));
            var dataAxis = this.companyDatatemp.categories;
            var data = this.companyDatatemp.data;
            var yMax = this.companyDatatemp.data[0];
            var dataShadow = [];

            for (var i = 0; i < data.length; i++) {
                dataShadow.push(yMax);
            }

            let option = {
                title: {
                    text: api.getCookie('language') == 'en' ? 'Company ranking' : '公司排行榜',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#000000',
                        fontSize:36,
                    }
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 12
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    scale:true,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    { // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: {color: 'rgba(0,0,0,0.05)'}
                        },
                        barGap:'-100%',
                        barCategoryGap:'40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: data
                    }
                ]
            };


            this.chartLine.setOption(option)
            this.ischartOK[1] = true;
            this.check();
        },

        check: function() {
            if(this.ischartOK[0] == true && this.ischartOK[1] == true) {
                this.loading = false;
            }
        },

        generatePolicy(tabkey,str){
            if(api.getCookie('language') == 'en') {
                let policyInfoTemp = policyInfo_EN;
                let temp = "DB_Policy_"+tabkey+"_"+str;
                return this.companyListCNToEN[tabkey] +" - "+policyInfoTemp[temp].title.split("-")[1].slice(1)
            } else {
                return str;
            }
        },

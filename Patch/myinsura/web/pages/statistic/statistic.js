var wxCharts = require('wxcharts-min.js'); 
var app = getApp();
var pieChart = null;
var columnChart = null;

Page({
  data: {
    // policyData: [{ name: "中国平安", data: 18 },
    //               { name: "中国人寿", data: 33 },
    //               { name: "中国太平洋", data: 24 },
    //               { name: "新华保险", data: 23 },
    //               { name: "中国人保", data: 10 }],
    // companyData: {
    //   title: '总录入量前五',
    //   data: [15, 20, 45, 37,33],
    //   categories: ['人人安康百万医疗险', '康泰终身险', '意外伤害险', '少儿乐两全险','i随性A款两全险']
    // },

    policyData: [],
    companyData: {},

    policyDatatemp: [],
    companyDatatemp:{
      title: '总录入量前五',
      data: [],
      categories: []
    },
  
})

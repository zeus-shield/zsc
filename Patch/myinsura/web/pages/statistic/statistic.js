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
  
    chartTitle: '总成交量',

    tabs: ["险种排行榜","公司排行榜"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    windowHeight:0,
    windowWidth:0,
  },
 
  onLoad: function () {
    this.navbarShow();
    this.getData();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getData();
    wx.stopPullDownRefresh();
  },

  //获取统计数据
  getData:function() {
    let handler = this;
    this.data.policyDatatemp =[];
    this.data.companyDatatemp= {
      title: '总录入量前五',
        data: [],
          categories: []
    };
    wx.request({
      url: 'http://minetrack.io:3001/WechatAnalytics/getKeys',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
      },
      success(res) {
        if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {//交易成功没拿到值
          wx.showToast({
            title: '没有有效保险数据',
            icon: 'success',
            duration: 2000
          })
          handler.setData({
            hascompany: false
          })
        } else if (res.data.code == "-9") {
          handler.getcompanyInfo(i);
          wx.showToast({
            title: '交易报错',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.code == "0") {
          let temp = res.data.data[1].split(",");
          handler.statisticData(temp);
        }
      },
      fail(error) {
        wx.showToast({
          title: '网络故障',
          icon: 'success',
          duration: 2000
        })
      },
    })
  },
})

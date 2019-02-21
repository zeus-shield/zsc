const app = getApp();
const PolicyInfo = require("policyInfo.js");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    //navbar控制参数
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    //navbar数据
    tabs: [],
    //九宫格数据
    grids: [],
    //九宫格被选中选项
    policyKey: "DB_Policy_中国人保_寿险鑫利年金险",

    //公司及险种数据
    company: {},
    policyInfo:{},

    adding:"",
    isLoaded:false
  },

  onLoad: function () {
    this.getAllComapnyAndPolicy();
  },

  onPullDownRefresh() {
    this.getAllComapnyAndPolicy();
    wx.stopPullDownRefresh();
  },
  //请求获取公司及险种
  getAllComapnyAndPolicy: function () {
    let handler = this;
 
    if (handler.data.company = {}) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 10000
      })
    }
    wx.request({
      url: 'http://minetrack.io:3001/WechatCompany/getAll',
      method: 'get',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {},
      success(res) {
        if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {//交易成功没拿到值
          wx.showToast({
            title: '没拿到值',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.code == "-9") {
          wx.showToast({
            title: '交易报错',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.code == "0") {
          let temp = JSON.parse(res.data.data[1]);
          delete temp.Size
          handler.setData({
            company: temp
          })
          handler.showCompanyAndPolicy();
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
const app = getApp()

Page({
  data: {

    createTemp: {},
    companyArray: {},
    policyInfo: {},

    //保单模板
    policyTemp: "",
    policyTempArray: [],
    policyTempData: {},

    multiArray: [],
    multiIndex: [0, 0],

    bol: false,

    accounts: [],
    accountIndex: 0,
    accounts1: [],
    accountIndex1: 0,
    radioText: "",
    para:"",
    title:"",

    radio: [
      { value: "0", name: "年交", checked: 'true' },
      { value: "1", name: "月交" }
    ],
    flag: false,
    date: "1980-01-01",
    date1: "1980-01-01"


  },
  //用户点击确认选择公司和保单
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    this.getPolicyTemp();
  },
  //载入页面
  onLoad: function (option) {
    this.initData();
    this.getPolicyTemp(option.id);
    this.setData({
      para: option.id
    })

    let temp = option.id.split("_");
    this.setData({
      title: temp[2]+"-"+temp[3]
    })
   

  },
  //下拉刷新
  onPullDownRefresh() {
   
  },

  initData: function(){
    let handler = this;
    let arr = []
    for (var i = 0; i < 100; i++) {
      arr.push(i + "年");
    }
    handler.setData({
      accounts: arr
    })

    let arr1 = []
    for (var i = 0; i < 100; i++) {
      arr1.push(i + "年");
    }
    handler.setData({
      accounts1: arr1
    })

  },
  //获取保单模板
  getPolicyTemp: function (policyTemKey) {
    let handler = this;
 
    let key = policyTemKey;
    wx.request({
      url: 'http://minetrack.io:3001/WechatTem/getByKey',
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        Key: key
      },
      success(res) {
        if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {
          //edit  交易成功没拿到值
          wx.showToast({
            title: '没有保单模板',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.code == "-9") {
          //edit  交易失败
          wx.showToast({
            title: '交易报错',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.code == "0") {
          //edit
          handler.setData({
            policyTemp: res.data.data,
            bol: true
          })
          handler.createPolicyTemp();
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
  createPolicyTemp: function () {
    let tempArray = this.data.policyTemp.split("#");
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i] == "Key" || tempArray[i] == "UserKey") {
        tempArray.splice(i, 1);
        i--;
      }
    }
    let policyTempDataPara = {};
    for (var i in tempArray) {
      if (tempArray[i] == "有无社保（被保人）") {
        policyTempDataPara[tempArray[i]] = "无社保";
      } else if (tempArray[i] == "有无交通事故") {
        policyTempDataPara[tempArray[i]] = "无交通事故";
      } else if (tempArray[i] == "自动续保") {
        policyTempDataPara[tempArray[i]] = "不自动续保";
      } else if (tempArray[i] == "缴费方式") {
        policyTempDataPara[tempArray[i]] = "年交";
      } else if (tempArray[i] == "车龄") {
        policyTempDataPara[tempArray[i]] = "1年";
      } else if (tempArray[i] == "保障年限") {
        policyTempDataPara[tempArray[i]] = "1年";
      } else {
        policyTempDataPara[tempArray[i]] = "";
      }
    }
    this.setData({
      policyTempArray: [],
    })
    this.setData({
      policyTempArray: tempArray,
      policyTempData: policyTempDataPara
    })

    console.log(this.data.policyTempArray)

  },
})
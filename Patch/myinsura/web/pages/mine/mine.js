const app = getApp()

Page({

  data: {
    userAllPolicy: [],
    userAllPolicytemp:[],
    userAllPolicyHiddenValue:[],
    isGet:[],

    userInfo: {},
    code:"",
    hasPolicy:false,
    isIdHidden:true,
    isHashHidden:[],

  },
  //载入
  onLoad: function (e) {
    this.getAllPolicy();
    this.setData({
      userInfo: app.globalData.userInfo,
      code: app.globalData.code
    })

  },

  //下拉刷新
  onPullDownRefresh() {
    this.getAllPolicy();
    wx.stopPullDownRefresh();
  },
  //获取用户所有保单信息
  getAllPolicy:function() {
    let handler = this;
    let userKey = app.globalData.code;
    //let userKey ="ddroyce@163.com";

    if (handler.data.userAllPolicy = [0]) {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 10000
      })
    }
    wx.request({
      url: 'http://minetrack.io:3001/WechatuserPolicy/getPolicies',
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        UserKey: userKey
      },
      success(res) {
        if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {
          wx.showToast({
            title: '没有保单',
            icon: 'success',
            duration: 2000
          })
          console.log(res.data.msg);
        } else if (res.data.code == "-9") {
          console.log(res.data.error);
        } else if (res.data.code == "0") {
          wx.hideToast();
          let userPolicy = res.data.data[1].split(",");
          for (var i in userPolicy) {
            handler.data.isGet.push(false);
          }
          let para = [];
          let isHashhiddentemp = [];
          for (var i in userPolicy) {
            let temp = userPolicy[i].substr(userKey.length + 1, userPolicy[i].length).split("_");
            para.push({
              name: temp[0] + "公司" + temp[1],
              key: userPolicy[i],
              value: {}
            });
            isHashhiddentemp.push(false);
          }
          handler.setData({
            userAllPolicytemp : para,
            isHashHidden: isHashhiddentemp
          })
          console.log(handler.data.isHashHidden)
          for (let i = 0; i < handler.data.userAllPolicytemp.length; i++) {
            handler.getPolicyInfo(i);
          }
        }
      },
      fail(error) {
        wx.showToast({
          title: '网络故障',
          icon: 'success',
          duration: 2000
        })
        console.log("网络故障");
      },
    })
  },
})
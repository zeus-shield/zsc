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
  //获取特定保单的所有信息
  getPolicyInfo: function(i){
    let handler = this;
    let key = handler.data.userAllPolicytemp[i].key;
    wx.request({
      url: 'http://minetrack.io:3001/WechatPolicy/getByKey',
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        Key: key
      },
      success(res) {
        if (res.data.code == "-1" || res.data.code == "-2" || res.data.code == "-3") {//交易成功没拿到值
          wx.showToast({
            title: '您目前没有保单',
            icon: 'success',
            duration: 2000
          })
          handler.setData({
            hasPolicy: false
          })
        } else if (res.data.code == "-9") {
          handler.getPolicyInfo(i);
          wx.showToast({
            title: '交易报错',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.code == "0") {
          let temp = JSON.parse(res.data.data[1]);
          console.log(temp);
          delete temp.Size;
          delete temp.Key;
          delete temp.UserKey;
          handler.data.userAllPolicytemp[i].value = temp
          handler.data.isGet[i] = true;

          if(handler.check() == true) {
            let temp = [];
            for (let i = 0; i < handler.data.userAllPolicytemp.length; i++) {
              temp.push(true);
            }
            handler.setData({
              userAllPolicy:handler.data.userAllPolicytemp,
              userAllPolicyHiddenValue:temp,
              hasPolicy: true
            })
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
  //检查是否获取保单信息
  check: function() {
    for(let i = 0; i < this.data.isGet.length; i++) {
      if(this.data.isGet[i] == false) {
        return false;
      }
    }
    return true;
  },
  //订单详情展示
  show: function(e) {
    let id = parseInt(e.currentTarget.id);
    let temp = this.data.userAllPolicyHiddenValue;
    if (temp[id] == false) {
      temp[id] = true;
    } else {
      temp[id] = false;
    }
    this.setData({
      userAllPolicyHiddenValue: temp,
    })
  },
  //跳转至区块链
  jmp2rinkeby:function(e){
    console.log(e)
    wx.navigateTo({
      url: "../rinkeby/rinkeby?id=" + e.currentTarget.id,
    })

  },
  switchIdHidden: function() {
    if(this.data.isIdHidden == false) {
      this.setData({
        isIdHidden:true
      });
    } else {
      this.setData({
        isIdHidden: false
      });
    }
  },
  switchHashHidden: function(e) {
    let index = parseInt(e.currentTarget.id);
    if (this.data.isHashHidden[index] == false) {
      let temp = this.data.isHashHidden;
      temp[index] = true;
      this.setData({
        isHashHidden: temp
      });
    } else {
      let temp = this.data.isHashHidden;
      temp[index] = false;
      this.setData({
        isHashHidden: temp
      });
    }
  }
})
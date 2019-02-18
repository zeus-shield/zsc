const app = getApp()

Page({
  data: {
    motto: '点击进入Myinsura',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLogining:false
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function (e) {
    console.log("getUserInfo");
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jmp2getOpenID:function(){
    wx.switchTab({
      url: '../companyAndPolicy/companyAndPolicy'
    })
  },
  loginIn: function () {
    if(this.data.isLogining == false) {
      this.setData({
        isLogining:true
      })
      wx.showToast({
        title: '身份登录中',
        icon: 'loading',
        duration: 50000
      })
      let handler = this;
      wx.request({
        url: 'http://minetrack.io:3001/WechatIndex/login',
        method: 'post',
        data: {
          Code: app.globalData.code,
          NickName: handler.data.userInfo.nickName
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        success(res) {
          if (res.data.code == 0) {//新用户
            app.globalData.code = res.data.data;
            app.globalData.isLogin = true;
            app.globalData.notice = '欢迎新用户'
            // wx.showToast({
            //   title: '欢迎新用户',
            //   icon: 'success',
            //   duration: 3000,
            //   success: function () {
            //     wx.switchTab({
            //       url: '../index/index',
            //     })
            //   }
            // })
            wx.switchTab({
              url: '../companyAndPolicy/companyAndPolicy',
            })

          } else if (res.data.code == 3) {//老用户，拿data值
            app.globalData.isLogin = true;
            app.globalData.code = res.data.data;
            app.globalData.notice = '欢迎老用户'
            console.log(app.globalData.isLogin);

            wx.switchTab({
              url: '../companyAndPolicy/companyAndPolicy',
            })
          } else {
            console.log(res.data)
            //提示用户身份识别有误
            wx.showToast({
              title: '身份识别有误',
              icon: 'success',
              duration: 1500
            })
          }
          app.globalData.notice = '身份识别有误'
        },
        fail(error) {
          //console.log(error);
          //网络延迟，请重输入
          wx.showToast({
            title: '打开调试',
            icon: 'success',
            duration: 1500
          })


        },
      })
    }
    
  }
})

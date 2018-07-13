//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var constants = require('./vendor/wafer2-client-sdk/lib/constants');
App({
  
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);
      //  this.getUserInfo();
       
    },
    d: {
      hostUrl: 'https://hmkbdxso.qcloud.la',
      userId: 1,
      appId: "wx42812b1c7baaebc0",
      appKey: "28f98a89ea503b480899e9e2af4ef0ad",
      ceshiUrl: `https://hmkbdxso.qcloud.la/weapp/login`,
    },
    getUserInfo: function (cb) {
      var that = this
      if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
      } else {
        //调用登录接口
        wx.login({
          success: function (res) {
            var code = res.code;
            console.log(code);
            //get wx user simple info
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo);
                //get user sessionKey
                //get sessionKey
                var header = {};

                header[constants.WX_HEADER_CODE] = code;
                header[constants.WX_HEADER_ENCRYPTED_DATA] = res.encryptedData;
                header[constants.WX_HEADER_IV] = res.iv;
                that.getUserSessionKey(res.userInfo,header);
              }
            });
          }
        });
      }
    },
    getUserSessionKey: function (data1, header) {
      //用户的订单状态
      var that = this;
      wx.request({
        url: that.d.ceshiUrl,
        method: 'GET',
        header: header,
        data: "",
        success: function (res) {
          //--init data        
          var data = res.data;
          if (data.code != 0) {
            wx.showToast({
              title: "登录失败",
              duration: 2000
            });
            return false;
          }
          //console.log(data.openid)
          that.globalData.userInfo['sessionId'] = data.data.skey;
          that.globalData.userInfo['openid'] = data.data.userinfo.openId;
          console.log(data.data.skey, data.data.userinfo.openId);
          that.d.userId = data.data.userinfo.openId;
          try {
            wx.setStorageSync('openid', data.data.userinfo.openId)
          } catch (e) {
            console.log(e)
          }  
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！err:getsessionkeys',
            duration: 2000
          });
        },
      });
    },
    globalData: {
      userInfo: null
    },

    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
    }
})
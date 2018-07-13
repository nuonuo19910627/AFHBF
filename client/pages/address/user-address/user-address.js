// pages/address/user-address/user-address.js
var app = getApp();
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    uid:"",
    num:0,
    userId:0,
    cartId:0,
    count_id:0,
  },
  onLoad: function (options) {
    console.log("user-address load");
    var that = this;
    var openid = wx.getStorageSync('openid') || []
    console.log(openid);
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      cartId : options.cartId,
      count_id : options.count_id,
      userId: openid,
    });
   
   that.getALLAddress();
  },
  getToPay: function (options) {
    wx.redirectTo({
      url: '../../pay/pay?cartId=' + this.data.cartId + '&count_id=' + this.data.count_id + '&addpkey=' + options.currentTarget.dataset.id,
    });
  },
  getALLAddress: function () {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getaddress`,
      login: false,
      data: {
        uid: that.data.userId,
      },
      success(res) {
        var address = res.data.data;
        console.log(address);
        if (address == '') {
          var address = []
        }

        that.setData({
          address: address,
          //cartId: cartId,
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  setDefault: function(e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    qcloud.request({
      url: `${config.service.host}/weapp/setdefaultaddress`,
      login: false,
      data: {
        uid: that.data.userId,
        addrId: addrId,
      },
      success(res) {
       that.getALLAddress();
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
    /*
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/set_default',
      data: {
        uid:app.d.userId,
        addr_id:addrId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var status = res.data.status;
        var cartId = that.data.cartId;
        if(status==1){
          if (cartId) {
            wx.redirectTo({
              url: '../../order/pay?cartId=' + cartId,
            });
            return false;
          }

          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          
          that.DataonLoad();
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    */
  },
  delAddress: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    qcloud.request({
      url: `${config.service.host}/weapp/delAddress`,
      login: false,
      data: {
        addrId: addrId,
      },
      success(res) {
        that.getALLAddress();
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
    /*
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Address/del_adds',
          data: {
            user_id:app.d.userId,
            id_arr:addrId
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // success
            var status = res.data.status;
            if(status==1){
              that.DataonLoad();
            }else{
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
    });
*/
  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/index',
      data: {
        user_id: that.data.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var address = res.data.adds;
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },
})
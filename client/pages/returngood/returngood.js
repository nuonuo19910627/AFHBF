var app = getApp();
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
// pages/order/downline.js
Page({
  data: {
    orderId: 0,
    reason: '',
    remark: '',
    imgUrl: '',
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.F_PKEY,
    });
  },
  submitReturnData: function () {
    //console.log(this.data);
    //数据验证
    if (!this.data.remark) {
      wx.showToast({
        title: '请填写退款原因',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/updateorderfk`,
      login: false,
      data: {
        type: "3",//1：根据F_PKEY付款2:根据F_ORDER_ID付款3:根据F_PKEY将订单改为5已完成已退款
        //uid: that.data.userId,
        F_ORDER_ID: that.data.orderId,
        F_TKYY: that.data.remark,
        paytype:"",
        aid: "",//地址的id
        //remark: that.data.remark,//用户备注
        // price: that.data.total,//总价
        //vid: that.data.vid,//优惠券ID
      },
      success(res) {
        wx.showToast({
          title: "申请退款成功",
          duration: 3000
        });
        wx.redirectTo({
          url: '../myorders/myorders?currentTab=0',
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })

  },
  reasonInput: function (e) {
    this.setData({
      reason: e.detail.value,
    });
  },
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value,
    });
  },
  uploadImgs: function () {

    wx.chooseImage({
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            //do something
          }
        })
      }
    });
  },
})
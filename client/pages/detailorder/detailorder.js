var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    orderId: 0,
    orderData: {},
    addressData:{},
    proData: [],
    F_DDZT_MC :"",
    userId:0,
    F_DDZT :0,
    paytype:"cash",
    btnDisabled: false,
  },
  onLoad: function (options) {
    console.log("detailorder load")
    var openid = wx.getStorageSync('openid') || []
    console.log(openid);
    this.setData({
      orderId: options.orderId,
      userId: openid
    })
    this.loadProductDetail();
  },
  getAddress: function (addresspkey) {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getorderAddress`,
      login: false,
      data: {
        F_PKEY: addresspkey,
      },
      success(res) {
        that.setData({
          addressData: res.data.data,
          //proData: pro
        });
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  getdefaultAddress: function (e) {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getdefaultaddress`,
      login: false,
      data: {
        uid: that.data.userId,
      },
      success(res) {
        that.setData({
          addressData: res.data.data,
          //proData: pro
        });
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  //支付订单
  createProductOrder: function () {
    this.setData({
      btnDisabled: false,
    })
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/updateorderfk`,
      login: false,
      data: {
        //uid: that.data.userId,
        type: "1",//1：根据F_PKEY付款2:根据F_ORDER_ID付款
        F_ORDER_ID: that.data.orderData[0].F_PKEY,
        paytype: that.data.paytype,
        aid: that.data.addressData[0].F_PKEY,//地址的id
       // remark: that.data.remark,//用户备注
        // price: that.data.total,//总价
        //vid: that.data.vid,//优惠券ID
      },
      success(res) {
        wx.showToast({
          title: "支付成功",
          duration: 3000
        });
        wx.switchTab({
          url: '../index/index',
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })

  },
  //微信支付
  createProductOrderByWX: function (e) {

    this.setData({
      paytype: 'weixin',
    });
    this.createProductOrder();

  },
  createProductOrderByXX: function (e) {

    this.setData({
      paytype: 'cash',
    });
    this.createProductOrder();

  },
  loadProductDetail: function () {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getdetailorder`,
      login: false,
      data: {
        F_PKEY: that.data.orderId,
      },
      success(res) {
        //var pro = res.data.data;
        let ord = res.data.data;
        if (ord[0].F_SHDZ_ID != null){
          that.getAddress(ord[0].F_SHDZ_ID);
        }else{
          that.getdefaultAddress();
        }
        /*
        if(ord[0].F_DDZT == "1"){
          that.setData({
            F_DDZT_MC: "待付款",
            F_DDZT: "1",
          });
        }else if (ord[0].F_DDZT == "2") {
          that.setData({
            F_DDZT_MC: "待发货",
          });
         
        } else if (ord[0].F_DDZT == "3") {
          that.setData({
            F_DDZT_MC: "待收货",
          });
         
        } else if (ord[0].F_DDZT == "4") {
          that.setData({
            F_DDZT_MC: "已完成",
          });
          
        }
        */
        that.setData({
          orderData: ord,
          //proData: pro
        });
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
    /*
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_details',
      method: 'post',
      
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        if (status == 1) {
          var pro = res.data.pro;
          var ord = res.data.ord;
          that.setData({
            orderData: ord,
            proData: pro
          });
        } else {
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
    */
  },

})
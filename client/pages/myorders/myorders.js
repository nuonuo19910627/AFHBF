// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
//var common = require("../../utils/common.js");
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isStatus: 'pay',//10待付款，20待发货，30待收货 40、50已完成
    page: 0,
    refundpage: 0,
    orderList: [],
    orderList0: [],
    orderList1: [],
    orderList2: [],
    orderList3: [],
    orderList4: [],
    userId: 0,
    address:[],
    paytype:"weixin",
  },
  onLoad: function (options) {
    console.log("myorders");
    this.initSystemInfo();
    var openid = wx.getStorageSync('openid') || []
    console.log(openid);
   
    this.setData({
      currentTab: parseInt(options.currentTab),
      //isStatus: options.otype,
      userId: openid
    });

    this.loadOrderList();
  },
  getDefaltAddress: function (e) {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getdefaultaddress`,
      login: false,
      data: {
        uid: that.data.userId,
      },
      success(res) {
        that.setData({
          address: res.data.data[0],
        });
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  //支付订单
  createProductOrder: function (f_id) {
    this.setData({
      btnDisabled: false,
    })
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/updateorderfk`,
      login: false,
      data: {
        type:"1",//1：根据F_PKEY付款2:根据F_ORDER_ID付款
        //uid: that.data.userId,
        F_ORDER_ID: f_id,
        paytype: that.data.paytype,
        aid: that.data.address.F_PKEY,//地址的id
        //remark: that.data.remark,//用户备注
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
  payOrderByWeXX: function (e) {
    var f_id = e.target.dataset.orderid;
    this.getDefaltAddress();
    var that = this;
    wx.showActionSheet({
      itemList: ['微信支付', '线下支付'],
      itemColor: '#02e100',
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == "0"){
          that.setData({
            paytype: 'weixin',
          });
          that.createProductOrder(f_id);
        }else{
          that.setData({
            paytype: 'cash',
          });
          that.createProductOrder(f_id);
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })  
  },

  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },

  //取消订单
  removeOrder: function (e) {
    var that = this;
    var F_PKEY = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '确定要取消订单？',
      success: function (res) {
        if (res.confirm) {
          qcloud.request({
            url: `${config.service.host}/weapp/delorder`,
            login: false,
            data: {
              type: "1",//1：根据F_PKEY付款2:根据F_ORDER_ID付款
              //uid: that.data.userId,
              F_PKEY: F_PKEY,
              //paytype: that.data.paytype,
              //aid: that.data.address.F_PKEY,//地址的id
              //remark: that.data.remark,//用户备注
              // price: that.data.total,//总价
              //vid: that.data.vid,//优惠券ID
            },
            success(res) {
              wx.showToast({
                title: "删除成功",
                duration: 3000
              });
              that.loadOrderList();
            },
            fail(error) {
              util.showModel('请求失败', error);
              console.log('request fail', error);
            }
          })
        }
      }
    });
  },

  //确认收货
  recOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function (res) {
        qcloud.request({
          url: `${config.service.host}/weapp/updateorderfk`,
          login: false,
          data: {
            type: "4",//1：根据F_PKEY付款2:根据F_ORDER_ID付款3:根据F_PKEY将订单改为5已完成已退款4:根据F_PKEY将订单改为5已完成已收货
            //uid: that.data.userId,
            F_ORDER_ID: orderId,
            //F_TKYY: that.data.remark,
            //paytype: "",
           // aid: "",//地址的id
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

      }
    });
  },

  loadOrderList: function () {
   // util.showBusy('请求中...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/myorders`,
      login: false,
      data: {
        uid: that.data.userId,
        currentTab: that.data.currentTab,
      },
      success(res) {
       // util.showSuccess('请求成功完成')
        //--init data        
       // var status = res.data.status;
        var list = res.data.data;
        switch (that.data.currentTab) {
          case 1:
            that.setData({
              orderList0: list,
            });
            break;
          case 2:
            that.setData({
              orderList1: list,
            });
            break;
          case 3:
            that.setData({
              orderList2: list,
            });
            break;
          case 4:
            that.setData({
              orderList3: list,
            });
            break;
          case 0:
            that.setData({
              orderList: list,
            });
            break;
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },


  // returnProduct:function(){
  // },
  initSystemInfo: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          that.loadOrderList();
          break;
        case 1:
          !that.data.orderList0.length && that.loadOrderList();
          break;
        case 2:
          !that.data.orderList1.length && that.loadOrderList();
          break;
        case 3:
          !that.data.orderList2.length && that.loadOrderList();
          break;
        case 4:
          !that.data.orderList3.length && that.loadOrderList();
          break;
        case 5:
          that.data.orderList4.length = 0;
          that.loadReturnOrderList();
          break;
      }
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderId;
    var order_sn = e.currentTarget.dataset.ordersn;
    if (!order_sn) {
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 调用服务器微信统一下单接口创建一笔微信预订单
   */
  //   prePayWechatOrder: function(orderId){
  //     var uri = "/ztb/userZBT/GetWxOrder";
  //     var method = "post";
  //     var dataMap = {
  //       SessionId: app.globalData.userInfo.sessionId,
  //       OrderNo: orderId
  //     }
  //     console.log(dataMap);
  //     var successCallback = function (response) {
  //       console.log(response);
  //     };
  //     common.sentHttpRequestToServer(uri, dataMap, method, successCallback);
  //   }
})
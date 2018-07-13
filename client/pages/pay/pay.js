var app = getApp(); 
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
// pages/order/downline.js
Page({
  data: {
    itemData: {},
    userInfo: {},
    userId: 0,
    paytype: 'weixin',//0线下1微信
    remark: '',
    cartId:'',
    count_id:'',
    addrId: 0,//收货地址//测试--
    btnDisabled: false,
    productData: [],
    address: {},
    total: 0,
    vprice: 0,
    vid: 0,
    addemt: 1,
    vou: [],
    order: [], 
    formId: '',
    form_id: 0,
    addpkey:'',
  },
  onLoad: function (options) {
    console.log('pay onLoad');  

    var openid = wx.getStorageSync('openid') || []
    console.log(openid);
   
    this.setData({
      cartId: options.cartId,
      count_id: options.count_id,
      userId: openid
    });
    if (options.addpkey != null){
      this.setData({
        addpkey: options.addpkey
      });

    }
    
   // app.globalData().userInfo;
      this.loadProductDetail();
    //}else{
   //   util.showModel('提示', "请先登录小程序");
   // }
   
    
    
  },
  sendDDMessage: function (options,e) {
    var that = this;
    let _access_token = '';
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + options;
    var F_NAME ='';
    for (var i = 0; i < that.data.productData.length;i++){
      if (F_NAME !=""){
        F_NAME +=",";
      }
      F_NAME += that.data.productData[i].F_NAME
    }
    let _jsonData = {
      access_token: options,
      touser: that.data.userId,
      template_id: 'b2u22z-ZAAvIjfRmuXwfXxoJquLCXh6ab5U2cxuqNAk',
      form_id: e.detail.formId,
      //page: "pages/index/index",
      data: {
        "keyword1": { "value": that.data.productData[0].F_ORDER_ID, "color": "#173177" },
        "keyword2": { "value": F_NAME, "color": "#173177" },
        "keyword3": { "value": that.data.total, "color": "#173177" },
        "keyword4": { "value": that.data.productData[0].F_DDSJ, "color": "#173177" },
        "keyword5": { "value": that.data.address.F_NAME, "color": "#173177" },
        "keyword6": { "value": that.data.address.F_PHONE, "color": "#173177" },
        "keyword7": { "value": that.data.address.F_ADDRESS, "color": "#173177" },
      }
    }
    console.log(_jsonData);
    wx.request({
      url: url,
      data: _jsonData,
      method: 'post',
      success: function (res) {
        console.log(res+"王菲")
        console.log(JSON.stringify(res));
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }

    }) 

  },
  getNowAccesstoken: function (e) {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx42812b1c7baaebc0&secret=28f98a89ea503b480899e9e2af4ef0ad',
      //data: _jsonData,
      method: 'get',
      success: function (res) {
        console.log(res);
        that.sendDDMessage(res.data.access_token,e);
        that.updateAccesstoken(res.data.access_token);
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }

    })
  },
  updateAccesstoken: function (e) {
    //先获取cAppinfo里面的access_token，比较时间，如果在7200秒内，则直接使用，否则获取新的，更新数据库，再调用接口
    var that = this;
    var access_token = '';
    var time = new Date().getTime(); 
    var time_sec = Math.floor(time / 1000)
    qcloud.request({
      url: `${config.service.host}/weapp/getAccessToken`,
      login: false,
      data: {
        type: '2',//1是获取数据，2是更新数据
        accesstoken : e,
        time_sec: time_sec,
      },
      success(res) {
       console.log(res);
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
 

  },
  testSubmit: function (e) {
    //先获取cAppinfo里面的access_token，比较时间，如果在7200秒内，则直接使用，否则获取新的，更新数据库，再调用接口
    var that = this;
    var  access_token = '';
    qcloud.request({
      url: `${config.service.host}/weapp/getAccessToken`,
      login: false,
      data: {
        type: '1',//1是获取数据，2是更新数据
      },
      success(res) {
       // that.getALLAddress();
        if (res.data.data[0].F_ACCESS_TOKEN == null){
          that.getNowAccesstoken(e);
        }else{
          var time1 = res.data.data[0].F_TOKEN_SJ;
          var time2 = new Date().getTime();
          var time_sec = Math.floor(time2 / 1000);
          if (parseInt(time_sec)-parseInt(time1) >7200){
            that.getNowAccesstoken(e);
          }else{
            that.sendDDMessage(res.data.data[0].F_ACCESS_TOKEN, e);
          }
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
    /*
    var self = this;
    let _access_token = '10_6FrHyUUPChnWq4AF__rOUXRUM5KPKSmszf7f10t6pI_qzBgynKtTVlu6fblRGH7_4_lP_VmO-eiX35seb-bfzvlqxGpJHUAhT_TVYx6lb3-iFpfp1x-eBI8MAIkIIMiAAAZZD';
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token ;
     let _jsonData = {
        access_token: _access_token,
        touser: 'oelW05HA7KLoOFcDhNLSljsETCks',
        template_id: 'b2u22z-ZAAvIjfRmuXwfXxoJquLCXh6ab5U2cxuqNAk',
        form_id: e.detail.formId,
        //page: "pages/index/index",
        data: {
          "keyword1": { "value": "测试数据一", "color": "#173177" },
          "keyword2": { "value": "测试数据二", "color": "#173177" },
          "keyword3": { "value": "测试数据三", "color": "#173177" },
          "keyword4": { "value": "测试数据四", "color": "#173177" },
        }
      }
    
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx42812b1c7baaebc0&secret=28f98a89ea503b480899e9e2af4ef0ad',
      //data: _jsonData,
      method: 'get',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }

    })  */
   
  },
  getAddress: function (addresspkey) {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getorderAddress`,
      login: false,
      data: {
        F_PKEY: that.data.addpkey,
      },
      success(res) {
        that.setData({
          address: res.data.data[0],
          addemt: "0",
        });
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  loadProductDetail: function () {
    var that = this;
   // util.showBusy('请求中...')
    qcloud.request({
      url: `${config.service.host}/weapp/makeorder`,
      login: false,
      data: {
        cart_id: that.data.cartId,
        count_id: that.data.count_id,
        uid: that.data.userId,
      },
      success(res) { 
        //util.showSuccess('请求成功完成');
        var total1 = 0;
        for (var i = 0; i < res.data.data.length;i++){
          total1 += parseFloat(res.data.data[i].F_ZJE);
        }
        
        if (that.data.addpkey != null&&that.data.addpkey != '') {
          that.getAddress();
        } else {
          that.getDefaltAddress();
        }
        that.setData({
         // addemt: res.data.addemt,
          productData: res.data.data,
          total: total1,
          //vprice: res.data.price,
          //vou: res.data.vou,
        });
        /*var adds = res.data.adds;
        if (adds) {
          var addrId = adds.id;
          that.setData({
            address: adds,
            addrId: addrId
          });
        }
        that.setData({
          addemt: res.data.addemt,
          productData: res.data.pro,
          total: res.data.price,
          vprice: res.data.price,
          vou: res.data.vou,
        });*/
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
   
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
          addemt: "0",
        });
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value,
    })
  },

  //选择优惠券
  getvou: function (e) {
    var vid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.vprice;
    var cprice = parseFloat(zprice) - parseFloat(price);
    this.setData({
      total: cprice,
      vid: vid
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
        type: "2",//1：根据F_PKEY付款2:根据F_ORDER_ID付款
        F_ORDER_ID: that.data.productData[0].F_ORDER_ID,
        paytype: that.data.paytype,
        aid: that.data.address.F_PKEY,//地址的id
        remark: that.data.remark,//用户备注
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
        });
        //that.submitForm(); 
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
  //线下支付
  // createProductOrderByXX:function(e){

  //   this.setData({
  //     paytype: 'cash',
  //   });
  //   wx.showToast({
  //     title: "线下支付开通中，敬请期待!",
  //     duration: 3000
  //   });
  //   return false;
  //   //this.createProductOrder();
  //   this.submitForm(); 
  // },

  //确认订单
  submitForm: function (e) { 
    //console.log(e)
    var that = this
    that.setData({
      form_id: e.detail.formId,
      btnDisabled: false,
    });
/*
    //创建订单
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/payment',
      method: 'post',
      data: {
        uid: that.data.userId,
        cart_id: that.data.cartId,
        type: that.data.paytype,
        aid: that.data.addrId,//地址的id
        remark: that.data.remark,//用户备注
        price: that.data.total,//总价
        vid: that.data.vid,//优惠券ID
        form_id: that.data.form_id,
      },

      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        //console.log(res)       
        var data = res.data;
        if (data.status == 1) {
          //创建订单成功
          if (data.arr.pay_type == 'cash') {
            wx.showToast({
              title: "请自行联系商家进行发货!",
              duration: 3000
            });
            return false;
          }
          if (data.arr.pay_type == 'weixin') {
            //微信支付
            that.wxpay(data.arr);
          }
          //    that.sendmessage();
        } else {
          wx.showToast({
            title: "下单失败!",
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
    */
  },
  sendmessage: function () {
    var that = this
    wx.request({
      url: app.d.ceshiUrl + '/Api/Mbnews/sendnews',
      data: {
        openid: app.globalData.userInfo['openid'],
        order_sn: that.data.order.order_sn,
        price: that.data.total,
        product_name: that.data.productData[0]['name'],
        formId: that.data.formId,
      },

      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header

      success: function (res) {
        //console.log(res)
      }
    })
    //console.log(that.data.order.order_sn);
    //console.log(app.globalData.userInfo['openid']);
    //console.log(that.data.productData[0]['name']);
    //console.log(that.data.total);


  },
  //调起微信支付
  wxpay: function (order) {
    // console.log(order);
    // console.log(app.globalData.userInfo['openid'])
    this.setData({
      order: order,
    })
    var that = this

    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: that.data.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        //console.log(res)
        that.setData({
          formId: res.data.arr.prepay_id,
        })
        //     that.sendmessage();
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
              }, 2500);

              //            that.sendmessage();

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
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },


});
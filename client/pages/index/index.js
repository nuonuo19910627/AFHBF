//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        goodsList: [],//首页所有推荐单品的数据
        imgUrls: [
          '/images/b1.jpg',
          '/images/b2.jpg',
          '/images/b3.jpg'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 3000,
        duration: 800,
        isShow: false,//是否显示购物车弹页
        buynum: 1,
        onegood:[]//获取单个商品的信息，放到弹页里
    },

    // 用户登录示例
    login: function() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    },
    onLoad: function () {
      /*
      var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = [0, 120];

var j = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
});

      
       */
      console.log('index onLoad'); 
      var that = this;
      //获取af_goods中所有未被禁用的数据，放到首页推荐单品里
      util.getGoodsList(function (data) {
        that.setData({
          goodsList: data.data
        })
      });
      var openid = wx.getStorageSync('openid') || []
      console.log(openid);
      if (openid.length == 0 ) {
        wx.navigateTo({
                url: '/pages/toLogin/toLogin',
        })
      //  wx.getSetting({
        //  success: (response) => {
         //   console.log(response)
         //   if (!response.authSetting['scope.userInfo']) {
         //     wx.navigateTo({
            //    url: '/pages/toLogin/toLogin',
           //   })
          //  }
         // }
       // })
        //this.getUserInfo();
        // 前往授权登录界面
     
        return;
      }

     
    },
    isShow: function (e) {
      var that = this;
      qcloud.request({
        url: `${config.service.host}/weapp/searchsonegood`,
        data: {
          "goodid": e.target.id
        },
        login: false,
        success(result) {        
          that.setData({
            onegood :result.data.data,
            isShow: true
            //userPasswordsql: result.data.data[0].F_PASSWORD,
          })
          
        },
        fail(error) {
          console.log('request fail', error);
        }
      })

     

    },
    isClose: function () {
      this.setData({
        isShow: false
      })
    },
    changeNum: function (e) {
      var that = this;
      if (e.target.dataset.alphaBeta == 0) {
        if (this.data.buynum <= 1) {
          buynum: 1
        } else {
          this.setData({
            buynum: this.data.buynum - 1
          })
        };
      } else {
        this.setData({
          buynum: this.data.buynum + 1
        })
      };
    },
    tocart:function(e){
      this.setData({
        isShow: false
      })
      //将购物车数据添加到缓存
      var that = this
      //获取缓存中的已添加购物车信息
      var cartItems = wx.getStorageSync('cartItems') || []
      console.log(cartItems)
      //判断购物车缓存中是否已存在该货品
      var exist = cartItems.find(function (ele) {
        return ele.id === that.data.onegood[0].F_ID
      })
      console.log(exist)
      if (exist) {
        //如果存在，则增加该货品的购买数量
        exist.num = parseInt(exist.num) + that.data.buynum
      } else {
        //如果不存在，传入该货品信息
        cartItems.push({
          id: that.data.onegood[0].F_ID,
          num: that.data.buynum,
          price: that.data.onegood[0].F_JE,
          title: that.data.onegood[0].F_NAME,
          image: that.data.onegood[0].F_IMAGE,
          selected: true
        })
      }

      //加入购物车数据，存入缓存
      wx.setStorage({
        key: 'cartItems',
        data: cartItems,
        success: function (res) {
          //添加购物车的消息提示框
          wx.showToast({
            title: "添加购物车",
            icon: "success",
            durantion: 2000
          })
        }
      })
      that.setData({
        buynum: 1,
        
        //userPasswordsql: result.data.data[0].F_PASSWORD,
      })
    }

})

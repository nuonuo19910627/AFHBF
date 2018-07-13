// pages/login/login.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    userName: '',
    userPassword: '',
    userPasswordsql:'',
    showLoading:true,
  },
  showLoading: function () {
    this.setData({
      showLoading: false
    })
  },
  cancelLoading: function () {
    this.setData({
      showLoading: false
    })
  },
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  }, 
  passInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
  }, 
  formSubmit: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e.detail.value);//格式 Object {userName: "user", userPassword: "password"}
      //获得表单数据
      var objData = e.detail.value;
      var that = this
      if (objData.userName && objData.userPassword) {
       
        qcloud.request({
          url: `${config.service.host}/weapp/searchsuser`,
          data:{
            "userName": that.data.userName
          },
          login: false,
          success(result) {
            wx.hideLoading()
            if (!result.data.data.length){
              util.showModel('提示', "此用户不存在");
              that.setData({
                userName: "",
                userPassword: '',
                showLoading: true,
              })
              return;
            }
            that.setData({
              userPasswordsql: result.data.data[0].F_PASSWORD,
            })
            if (result.data.data[0].F_PASSWORD != that.data.userPassword){
              util.showModel('提示', "密码不正确");
              that.setData({
                userPassword: '',
                showLoading: true,
              })
              return;
            }
            // 同步方式存储表单数据
            wx.setStorage({
              key: 'userName',
              data: objData.userName
            });
            wx.setStorage({
              key: 'userPassword',
              data: objData.userPassword
            });
            //跳转到成功页面
            wx.switchTab({
              url: '../index/index'
            })
          },
          fail(error) {
            wx.hideLoading()
            that.setData({
              showLoading: false
            })
            util.showModel('请求失败', error);
            console.log('request fail', error);
          }
        })
      } else if (!objData.userName){
        wx.hideLoading()
        that.setData({
          showLoading: true
        })
        util.showModel('提示', "请输入用户名");
        //return;
      } else if (!objData.userPassword) {
        wx.hideLoading()
        that.setData({
          showLoading: true
        })
        util.showModel('提示', "请输入密码");
        
        //return;
      }
   
    
  },

  //加载完后，处理事件 
  // 如果有本地数据，则直接显示
  onLoad: function (options) {
    var that = this;
    //获取本地数据
    
    wx.getStorage({
      key: 'userName',
      success: function (res) {
        console.log(res.data);
        that.setData({ userName: res.data });
      }
    });
    wx.getStorage({
      key: 'userPassword',
      success: function (res) {
        console.log(res.data);
        that.setData({ userPassword: res.data });
      }
    });
   
    
  

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
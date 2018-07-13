var qcloud = require('../vendor/wafer2-client-sdk/index')
var config = require('../config')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}
var getGoodsList = (callback) => {
 qcloud.request({
    url: `${config.service.host}/weapp/searchallgoods`,
    data:{
      "goods111":"2",
      "goods222": "2",
      "goods333": "2",
    },
    login: false,
    success(result) {
      //showSuccess('请求成功完成');
      if (result.statusCode == 200) {
        let data = result.data;
       // let allgoods = data.data.topList;
       // for (let i = 0; i < toplist.length; i++) {
      //    toplist[i].listenCount = formatWan(toplist[i].listenCount);
      //  }
        callback(data);
      }
      
     // allgoods = result.data.data;
     // that.setData({
       // allgoods: JSON.stringify(result.data),
     //   allgoods: result.data.data,
    //  })
    },
    fail(error) {
      showModel('请求失败', error);
      console.log('request fail', error);
    }
  })
 //return allgoods;
}
module.exports = { formatTime, showBusy, showSuccess, showModel, getGoodsList }

// page/component/new-pages/cart/cart.js
var util = require('../../utils/util.js')
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: {
      name: "hello"
    } 
  },
  onShow() {
    //{ id: 1, title: '新鲜芹菜 半斤', image: '/images/s5.png', num: 4, price: 0.01, selected: true },
    var that = this;    
    //获取当前缓存中所有购物车的数据
    var cartItems = wx.getStorageSync('cartItems') || []
    console.log(cartItems);
    if (cartItems.length > 0) {
      that.setData({
        carts: cartItems,
        hasList: true,
      })
      this.getTotalPrice();
    }else{
      that.setData({
        carts: [],               // 购物车列表
        hasList: false,          // 列表是否有数据
        totalPrice: 0,           // 总价，初始为0
      })
    }
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;

    this.setData({
      carts: carts
    });
    if (!selected == false){
      let selectAllStatus = this.data.selectAllStatus;
      if (selectAllStatus == true){
        this.setData({
          selectAllStatus: false,
         
        });
      }
     
    }
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    try {
      wx.setStorageSync('cartItems', carts)
    } catch (e) {
      console.log(e)
    }  
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    try {
      wx.setStorageSync('cartItems', carts)
    } catch (e) {
      console.log(e)
    }  
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    try {
      wx.setStorageSync('cartItems', carts)
    } catch (e) {
      console.log(e)
    }  
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    let selectednum = 0
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) { 
        selectednum++;                    // 判断选中才会计算价格
        total += parseInt(carts[i].num) * parseFloat(carts[i].price);   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
    if (selectednum == carts.length ){
      this.setData({
        selectAllStatus: true,
      
      });
    }
  },
  accountje() {
    // 初始化toastStr字符串
    var toastStr = '';
    var count_id = '';
    let carts = this.data.carts;
    var cart1 = [];
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        cart1.push(this.data.carts[i]);
        toastStr += this.data.carts[i].id;
        toastStr += ',';
        count_id += this.data.carts[i].num;
        count_id += ',';
      }
    }
    if (toastStr == '') {
      util.showModel('提示', "请选择要结算的商品！");
      return false;
    }
    function array_remove_repeat(a) { // 去重
      var r = [];
      for (var i = 0; i < a.length; i++) {
        var flag = true;
        var temp = a[i];
        for (var j = 0; j < r.length; j++) {
          if (temp === r[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          r.push(temp);
        }
      }
      return r;
    }
    function array_difference(a, b) { // 差集 a - b
      //clone = a
      var clone = a.slice(0);
      for (var i = 0; i < b.length; i++) {
        var temp = b[i];
        for (var j = 0; j < clone.length; j++) {
          if (temp === clone[j]) {
            //remove clone[j]
            clone.splice(j, 1);
          }
        }
      }
      return array_remove_repeat(clone);
    }
    var cart2 = array_difference(carts,cart1);
    //存回data
    wx.navigateTo({
      url: '../pay/pay?cartId=' + toastStr + '&count_id=' + count_id,
    })
    try {
      wx.setStorageSync('cartItems', cart2)
    } catch (e) {
      console.log(e)
    }  
  },
  onLoad: function () {
    console.log('goods onLoad');  
  },

})
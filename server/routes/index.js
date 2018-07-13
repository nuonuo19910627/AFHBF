/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')
//var models =  require('../tools/initdb');

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

//CGI加上hello world
router.get('/demo', controllers.demo)

//搜索商品返回信息
router.get('/searchssp', controllers.searchssp)



//首页返回af_goods所有信息，放到推荐单品里
router.get('/searchallgoods', controllers.searchallgoods)

//点击购物车图标时，获取当前产品的数据
router.get('/searchsonegood', controllers.searchsonegood)
//点击结算时，把选中的商品编号和用户id传过来，生成订单
router.get('/makeorder', controllers.makeorder)
//点击支付时，修改订单状态
router.get('/updateorderfk', controllers.updateorderfk)
//获取当前用户的订单
router.get('/myorders', controllers.myorders)
//取消未付款的订单
router.get('/delorder', controllers.delorder)
 // 获取指定订单详情信息
router.get('/getdetailorder', controllers.getdetailorder)
//点击保存地址时，保存到收货人地址表
router.get('/makeaddress', controllers.makeaddress)
//获取当前登录人的所有收货地址
router.get('/getaddress', controllers.getaddress)
//给当前登录人设置一个默认地址
router.get('/setdefaultaddress', controllers.setdefaultaddress)
//删除一个收货地址
router.get('/delAddress', controllers.delAddress)
  // 获得当前订单的收货地址详细信息
router.get('/getorderAddress', controllers.getorderAddress)
//获取默认地址
router.get('/getdefaultaddress', controllers.getdefaultaddress)
//获取accesstoken
router.get('/getAccessToken', controllers.getAccessToken)
//q去数据库查询用户是否存在
router.get('/searchsuser', controllers.searchsuser)
//router.get('/searchssp',function (req, res) {
  //models.Goods.forge().fetchAll().then(function (Goods) {
  //  res.json({ message: 'done', data: Goods });
 // }).catch(function (err) {
 //   res.json({ message: 'error', data: Goods });
 // });
//});

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

module.exports = router

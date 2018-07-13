var url = require('url');
var qs = require('querystring');//解析参数的库

  const { mysql: config } = require('../config');
  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.pass,
      database: config.db,
      charset: config.char,
      multipleStatements: true
    }
  });
module.exports = async (ctx, next) => {

  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  function guid() {
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
  }
  function getFormatdate(date, type) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    if (type == "1") {
      return y + '' + m + '' + d + '' + h + '' + minute + '' + second;
    } else if (type == "2") {
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }

  }
 
  var arg = url.parse(ctx.req.url).query;
  //把参数转换成键值对，再从中拿值
  var cart_id = qs.parse(arg)['cart_id'];
  var userId = qs.parse(arg)['uid'];
  var count_id = qs.parse(arg)['count_id'];

  var F_ID = cart_id.split(",");//商品编号
  var F_SL = count_id.split(",");//数量
  var calldata = [];
  //var F_PKEY = guid();
  var nowtime = new Date();
  var F_DDSJ = getFormatdate(nowtime, "1");
  var F_ORDER_ID = "DD" + F_DDSJ;
 var databack = {};
 for (var i = 0; i < F_ID.length - 1; i++) {
   await knex('AF_GOODS').where(function () {
     this.where('F_ID', F_ID[i])
   }).then(res => {

     var F_ZJE = F_SL[i] * res[0].F_JE;
     var datas = {
       F_PKEY: guid(),
       F_ORDER_ID: F_ORDER_ID,
       F_ID: F_ID[i],
       F_NAME: res[0].F_NAME,
       F_FL: res[0].F_FL,
       F_JE: res[0].F_JE,
       F_SL: F_SL[i],
       F_IMAGE: res[0].F_IMAGE,
       F_ZJE: F_ZJE,
       F_USER_ID: userId,
       F_DDSJ: F_DDSJ,
       F_DDZT_MC: "待付款",

     }
     calldata.push(datas);
   }, err => {
     throw new Error(err)
   })

   // var F_ZJE = parseFloat(F_JE) * parseInt(F_SL[i]);

 }
 for (var i = 0; i < calldata.length; i++) {
   await knex('AF_GOODS_ORDER').insert(calldata[i]).then(res => {
     console.log('数据库初始化成功！')
     ctx.state.data = calldata;
     console.log('数据库初始化成功1！')
     // ctx.state.data = {"mas":"222"};
   }, err => {
     throw new Error(err)
   })

   // var F_ZJE = parseFloat(F_JE) * parseInt(F_SL[i]);

 }
 
 
  
// insert into "books" ("title") values ('Slaughterhouse Five') returning "id"
  
}

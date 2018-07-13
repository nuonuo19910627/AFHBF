var url = require('url');
var qs = require('querystring');//解析参数的库
module.exports = async (ctx, next) => {
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

  //先从路径中拿参数
  var arg = url.parse(ctx.req.url).query;
  //把参数转换成键值对，再从中拿值
  var F_ORDER_ID = qs.parse(arg)['F_ORDER_ID'];
  var type = qs.parse(arg)['type'];
  var F_FKFS = qs.parse(arg)['paytype'];
  var F_SHDZ_ID = qs.parse(arg)['aid'];
  var F_BZ = qs.parse(arg)['remark'];
  var F_TKYY = qs.parse(arg)['F_TKYY'];
  var nowtime = new Date();
  var F_FKSJ = getFormatdate(nowtime, "1");
  if(type == "1"){
    await knex('AF_GOODS_ORDER')
      .where('F_PKEY', '=', F_ORDER_ID)
      .update({
        F_FKFS: F_FKFS,
        F_SHDZ_ID: F_SHDZ_ID,
        F_BZ: F_BZ,
        F_DDZT: '2',
        F_DDZT_MC :"待发货",
        F_FKSJ: F_FKSJ,
      })
  } else if (type == "2"){
    await knex('AF_GOODS_ORDER')
      .where('F_ORDER_ID', '=', F_ORDER_ID)
      .update({
        F_FKFS: F_FKFS,
        F_SHDZ_ID: F_SHDZ_ID,
        F_BZ: F_BZ,
        F_DDZT: '2',
        F_DDZT_MC: "待发货",
        F_FKSJ: F_FKSJ,
      })
  } else if (type == "3") {
    await knex('AF_GOODS_ORDER')
      .where('F_PKEY', '=', F_ORDER_ID)
      .update({
        F_DDZT: '4',
        F_DDZT_MC: '已退款',
        F_TKYY: F_TKYY,
      })
  } else if (type == "4") {
    await knex('AF_GOODS_ORDER')
      .where('F_PKEY', '=', F_ORDER_ID)
      .update({
        F_DDZT: '4',
        F_DDZT_MC: '已完成',
        F_TKYY: F_TKYY,
      })
  }

 
 


}

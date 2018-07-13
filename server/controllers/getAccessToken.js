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
  //先从路径中拿参数
  var arg = url.parse(ctx.req.url).query;
  //把参数转换成键值对，再从中拿值
  var type = qs.parse(arg)['type'];
  var accesstoken = qs.parse(arg)['accesstoken'];
  var time_sec = qs.parse(arg)['time_sec'];
  if(type == "1"){
    await knex.select().from('cAppinfo').then(res => {
      console.log('数据库初始化成功！')
      ctx.state.data = res;
      console.log('数据库初始化成功1！')
      // ctx.state.data = {"mas":"222"};
    }, err => {
      throw new Error(err)
    })
  } else if (type == "2") {
    await knex('cAppinfo')
      .where('appid', '=', 'wx42812b1c7baaebc0')
      .update({
        F_ACCESS_TOKEN: accesstoken,
        F_TOKEN_SJ: time_sec,
      })
  }
 
}

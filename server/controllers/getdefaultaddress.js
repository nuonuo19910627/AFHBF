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
  var F_USER_ID = qs.parse(arg)['uid'];
  await knex.where({'F_USER_ID': F_USER_ID,"F_DEFAULT":"1"}).select().from('AF_GOODS_ADDRESS').then(res => {
    console.log('数据库初始化成功！')
    ctx.state.data = res;
    console.log('数据库初始化成功1！')
    // ctx.state.data = {"mas":"222"};
  }, err => {
    throw new Error(err)
  })
}

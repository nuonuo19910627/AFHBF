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
  //var F_USER_ID = qs.parse(arg)['uid'];
  var F_PKEY = qs.parse(arg)['F_PKEY'];
  await knex('AF_GOODS_ORDER')
    .where('F_PKEY', F_PKEY)
    .del()


}

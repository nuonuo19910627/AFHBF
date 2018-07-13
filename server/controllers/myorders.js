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

  
  var arg = url.parse(ctx.req.url).query;
  //把参数转换成键值对，再从中拿值
  var currentTab = qs.parse(arg)['currentTab'];
  var userId = qs.parse(arg)['uid'];
  if (currentTab == "0"){
    await knex.where('F_USER_ID', userId).select().from('AF_GOODS_ORDER').then(res => {
      console.log('数据库初始化成功！')
      ctx.state.data = res;
      console.log('数据库初始化成功1！')
      // ctx.state.data = {"mas":"222"};
    }, err => {
      throw new Error(err)
    })
  }else{
    await knex.where({ 'F_USER_ID': userId, "F_DDZT": currentTab}).select().from('AF_GOODS_ORDER').then(res => {
      console.log('数据库初始化成功！')
      ctx.state.data = res;
      console.log('数据库初始化成功1！')
      // ctx.state.data = {"mas":"222"};
    }, err => {
      throw new Error(err)
    })
  }
  



  // insert into "books" ("title") values ('Slaughterhouse Five') returning "id"

}

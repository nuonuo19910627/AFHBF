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
  

  var arg = url.parse(ctx.req.url).query;
  //把参数转换成键值对，再从中拿值
  var F_USER_ID = qs.parse(arg)['uid'];
  var F_NAME = qs.parse(arg)['F_NAME'];
  var F_PHONE = qs.parse(arg)['F_PHONE'];
  var F_ADDRESS = qs.parse(arg)['F_ADDRESS'];
  var F_DEFAULT = qs.parse(arg)['F_DEFAULT'];
  var F_PKEY = guid();
  var calldata = {
    F_PKEY: F_PKEY,
    F_USER_ID: F_USER_ID,
    F_DEFAULT: F_DEFAULT,
    F_PHONE: F_PHONE,
    F_NAME: F_NAME,
    F_ADDRESS: F_ADDRESS
  };
  await knex('AF_GOODS_ADDRESS').insert(calldata).then(res => {
    console.log('数据库初始化成功！')
    ctx.state.data = res;
    console.log('数据库初始化成功1！')
    // ctx.state.data = {"mas":"222"};
  }, err => {
    throw new Error(err)
  })


  // insert into "books" ("title") values ('Slaughterhouse Five') returning "id"

}

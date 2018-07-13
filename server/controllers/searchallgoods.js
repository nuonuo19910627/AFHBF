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
  await knex.where({'F_DISABLED':"0"}).select('F_ID', 'F_NAME','F_JE','F_NOTE','F_IMAGE').from('AF_GOODS').then(res => {
    console.log('数据库初始化成功！')
    ctx.state.data = res;
    console.log('数据库初始化成功1！')
    // ctx.state.data = {"mas":"222"};
  }, err => {
    throw new Error(err)
  })
}

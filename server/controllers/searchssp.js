module.exports = async (ctx, next) => {
  const { mysql: config } = require('../config');
  console.log("2222")
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
  console.log("3333")
  //knex('AF_GOODS').where('F_ID', '0000000001').then(res => {
  // console.log(res)
  // ctx.state.data = res;
  //})
  //knex.select('F_ID').from('AF_GOODS').then((rows) => {
  //取到的数据
  //ctx.state.data = data;
  //console.log(data)
  //})

  await knex.select('F_ID','F_NAME').from('AF_GOODS').then(res => {
    console.log('数据库初始化成功！')
    ctx.state.data = res;
    console.log('数据库初始化成功1！')
    // ctx.state.data = {"mas":"222"};
  }, err => {
    throw new Error(err)
  })
  
  
  //return knex.transaction(function (trx) {
  //return Promise.all([
  // trx.raw('select F_ID from AF_GOODS')
  //  trx.raw('update ?? set `CD_collection` = `CD_collection` + 1 where `id` = ?', [Customer.table, id]),
  //Account.withdrawl(this.accountId, 5, trx)  // 在这里把transaction对象传入
  //  ])
  //})
  knex('AF_GOODS')
    .returning('F_ID')
    .insert({ F_ID: '00002', F_NAME: "2222" })
  //ctx.state.data = {"mag":"222"};
  console.log("4444")
}

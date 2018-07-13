var bookshelf = require('./initdb')();

var Goods = bookshelf.Model.extend({
  tableName: 'AF_GOODS',
});
module.exports = Goods;
const Sequilize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequilize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequilize = Sequilize;
db.User = require('./user')(sequelize, Sequilize);
db.Good = require('./good')(sequelize, Sequilize);
db.Auction = require('./auction')(sequelize, Sequilize);

// 1대 다 관계가 두 번 적용
// 사용자가 여러 상품을 등록할 수 있고, 사용자가 여러 상품을 낙찰받을 수도 있다.
// 둘을 구별하기 위해 as 속성에 owner, sold로 관계명을 적어준다.
// 각각 ownerId, soldId 컬럼으로 상품 모델에 추가된다.
db.Good.belongsTo(db.User, { as: 'owner' });
db.Good.belongsTo(db.User, { as: 'sold' });
// 한 사용자는 입찰을 여러 번 할 수 있다. 1:N
db.User.hasMany(db.Auction);
// 한 상품에 여러명 입찰 가능 1:N
db.Good.hasMany(db.Auction);
db.Auction.belongsTo(db.User);
db.Auction.belongsTo(db.Good);

module.exports = db;
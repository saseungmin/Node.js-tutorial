const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
// User와 Post는 1:N 관계로 시퀄라이즈는 Post 모델에 userId 컬럼를 추가한다.
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
// Post와 Hashtag의 관계는 N:M
// 헤시태그 하나에 여러개의 게시글을 가질 수 있고, 게시글 하나에 헤시태그 여러개를 가질 수 있다.
// N:M관계는 중간에 관계 테이블이 생성된다.
// 시퀄라이즈가 관계를 분석하여 PostHashtag테이블을 자동 생성한다.
// 컬럼명은 postId와 hashtagId 이다.
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
// 같은 테이블끼리도 N:M 관계를 가질 수 있다.
// 팔로잉 기능도 N:M이다.
// 같은 테이블일때는 이름을 따로 정해주어야 한다.
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

module.exports = db;

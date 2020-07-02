# ✔ 실시간 경매 시스템 만들기
- `package.json` 작성
<pre>
$ npm i connect-flash cookie-parser dotenv express express-session morgan multer pug
// 개발환경에서만 nodemon 사용
$ npm i -D nodemon
// MySQL 사용, 시퀄라이즈를 설치하고, 기본 디렉터리를 만든다.
$ npm i -g sequelize-cli
$ npm i sequelize mysql2
$ sequelize init
</pre>
- 사용자 모델, 제품 모델, 경매 모델로 구성한다. (`user.js`, `good.js`, `auction.js`)
- 모델 생성 후 모델을 데이터베이스 및 서버와 연결한다. (`config/config.json`)
- 데이터베이스 생성
<pre>
$ sequelize db:create
</pre>
- 모델 파일 수정(`models/index.js`)
> - 1대 다 관계가 두 번 적용
> - 사용자가 여러 상품을 등록할 수 있고, 사용자가 여러 상품을 낙찰받을 수도 있다.
> - 둘을 구별하기 위해 as 속성에 owner, sold로 관계명을 적어준다.
> - 각각 ownerId, soldId 컬럼으로 상품 모델에 추가된다.
<pre>
db.Good.belongsTo(db.User, { as: 'owner' });
db.Good.belongsTo(db.User, { as: 'sold' });
// 한 사용자는 입찰을 여러 번 할 수 있다. 1:N
db.User.hasMany(db.Auction);
// 한 상품에 여러명 입찰 가능 1:N
db.Good.hasMany(db.Auction);
db.Auction.belongsTo(db.User);
db.Auction.belongsTo(db.Good);
</pre>
# ✔ Mongo DB

## ✒ 데이터베이스 및 컬렉션 생성
- 몽고디비 프롬프트에 접속
<pre>
$ cd C:\Program Files\MongoDB\Server\4.2\bin
$ mongo
</pre>

- 데이터베이스를 만드는 명령어
<pre>
> use [데이터베이스명]
</pre>

- 데이터베이스 목록 확인
- 최소 한 개 이상의 데이터를 넣어야 목록에 표시된다.
<pre>
> show dbs
</pre>

- 현재 사용 중인 데이터베이스를 확인하는 명령어
<pre>
> db
</pre>

- 컬렉션은 따로 생성할 필요가 없다. 다큐먼트를 넣는 순간 컬렉션도 자동으로 생성된다. 하지만 직접 컬렉션을 생성하는 명령어
<pre>
> db.createCollection('users')
> db.createCollection('comments')
</pre>

- 생성한 컬렉션 목록 확인
<pre>
> show collections
</pre>

## ✒ MongoDB CRUD

### 🔶 Create
- 몽고디비는 컬렉션에 컬럼을 정의하지 않아도 컬렉션에는 아무 데이터나 넣을 수 있다.
- 자유롭다는 장점은 있지만 어떠한 값이 들어올지 모른다는 단점도 존재한다.
- Date나 정규표현식 같은 자바스크립트 객체를 자료형으로 사용할 수 있고, Binary Data, ObjectId, Int, Long, Decimal, Timestamp, JavaScript 등의 추가적인 자료형이 존재한다.
- ObjectId는 기본키랑 비슷하여 조회를 할때 ObjectId로 조회한다.
- `db.컬렉션명.save(다큐먼트)` : `save`로 다큐먼트를 생성할 수 있다.
<pre>
> db.users.save({name:'seung', age:26, married:false, comment:'안녕하세요.', createdAt:new Date()});
</pre>
- user 아이디를 조회한다.
<pre>
> db.users.find({name:'seung'},{_id:1})
{ "_id" : ObjectId("5eea0603deb71ca545fdfcf2") }
</pre>
- 그리고 comments에 Id 값으로 저장한다.
<pre>
> db.comments.save({commenter:ObjectId('5eea0603deb71ca545fdfcf2'), comment: '안녕하세요.',createdAt:new Date()});
WriteResult({ "nInserted" : 1 })
</pre>

### 🔶 Read
- 컬렉션 내의 모든 다큐먼트를 조회한다.
<pre>
> db.users.find({});
{ "_id" : ObjectId("5eea0603deb71ca545fdfcf2"), "name" : "seung", "age" : 26, "married" : false, "comment" : "안녕하세요.", "createdAt" : ISODate("2020-06-17T12:01:07.775Z") }
{ "_id" : ObjectId("5eea0629deb71ca545fdfcf3"), "name" : "dain", "age" : 22, "married" : false, "comment" : "안녕", "createdAt" : ISODate("2020-06-17T12:01:45.455Z") }
> db.comments.find({});
// .. 생략
</pre>

- 특정 필드만 조회
  - 두 번째 인자로 조회할 필드를 넣는다. 1 또는 true로 표시한 필드만 가져온다.
  - _id는 기본적으로 가져오게 되어 있으므로 0 또는 false를 입력해 가져오지 않도록 해야 한다.
<pre>
> db.users.find({}, {_id : 0, name : 1, married : 1});
{ "name" : "seung", "married" : false }
{ "name" : "dain", "married" : false }
</pre>
- 조회시 조건을 주려면 첫 번째 인자에 객체를 기입한다.
<pre>
> db.users.find({age : {$gt : 25}, married: false }, {_id : 0, name : 1, married : 1});
{ "name" : "seung", "married" : false }
</pre>

- 특수한 연산자 : `$gt(초과), $gte(이상) ,$lt(미만), $lte(이하), $ne(같지 않음), $or(또는), $in(배열 요소 중 하나)` 등이 있다.
<pre>
> db.users.find({ $or: [{ age : {$gt : 25}}, {married : false }]}, {_id : 0,name : 1,married : 1});
{ "name" : "seung", "married" : false }
{ "name" : "dain", "married" : false }
</pre>

- `sort` 메서드를 이용해서 정렬을 수행할 수 있다.(오름차순 -1, 내림차순 1)
<pre>
> db.users.find({}, {_id:0,name:1,married:1}).sort({age:1});
{ "name" : "dain", "married" : false }
{ "name" : "seung", "married" : false }
</pre>

- `limit` 메서드로 조회할 다큐먼트 개수를 설정할 수 있다.
<pre>
> db.users.find({}, {_id:0,name:1,married:1}).sort({age:1}).limit(1);
{ "name" : "dain", "married" : false }
</pre>
- `skip` 메서드를 사용하여 몇 개를 건너뛸지 설정할 수 있다.
<pre>
> db.users.find({}, {_id:0,name:1,married:1}).sort({age:1}).limit(1).skip(1);
{ "name" : "seung", "married" : false }
</pre>

### 🔶 Update
- 첫 번째 객체는 수정할 다큐먼트를 지정하는 객체이고, 두 번째 객체는 수정할 내용을 입력하는 객체이다.
- `$set` 연산자는 어떤 필드를 수정할지 정하는 연산자이다.
<pre>
> db.users.update({ name : 'seung'}, {$set : { comment:'하이루'}});
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
</pre>

### 🔶 Delete
- 삭제할 다큐먼트에 대한 정보가 담긴 객체를 첫 번째 인자로 제공한다.
<pre>
>db.users.remove({name : 'seung'});
WriteResult({ "nRemoved" : 1 })
</pre>

## ✒ 몽구스(mongoose) 사용하기
> - MySQL에 시퀄라이즈가 있다면 몽고디비에는 몽구스가 있다.
> - 몽구스는 시퀄라이즈와 달리 *ODM(Object Document Mapping)* 이라고 불린다.
> - 몽고디비는 릴레이션이 아니라 다큐먼트를 사용하므로 *ODM* 이다.
> - 몽고디비는 자유롭게 데이터를 넣을 수 있기 때문에 잘못된 자료형의 데이터를 넣을 수도 있고, 다른 다큐먼트에는 없는 필드의 데이터를 넣을 수 있다.
> - 때문에 몽구스는 **몽고디비에 데이터를 넣기 전 노드 서버 단에서 데이터를 한 번 필터링**하는 역할을 해준다.
> - 또한, MySQL에 있는 JOIN 기능을 `populate` 라는 메서드가 어느 정도 보완해준다.

- *Express-generator*로 프로젝트 생성
<pre>$ express --view=pug</pre>
- npm 패키지 설치
<pre>$ npm i</pre>
- *mongoose* 설치
<pre>$ npm i mongoose</pre>
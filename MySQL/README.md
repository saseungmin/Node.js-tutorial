# ✔ MySQL
## ✒ MySQL 설치
#### 🔸 윈도우 설치
- https://www.mysql.com/downloads/
- Choosing a Setup Type 에서 Custom 선택
- Select Products and Features 에서 Server와 Workbench 설치
- 계속 next 누르다가 Authentication Method 에서 Use Legacy Authentication Method 선택해 MySQL 5.x 버전 호화 선택
- `C:\Program Files\MySQL\MySQL Server 8.0\bin` 위치에서 `$ mysql -h localhost -u root -p` 입력
- Enter password: [패스워드 입력]
- mysql> exit => 나가기

## ✒ 데이터베이스 및 테이블 생성
- 프롬프트에 접속 후 `CREATE SCHEMA [데이터베이스명]`이 데이터베이스를 생성한다.
- MySQL에서는 데이터베이스와 Schema는 같은 개념이다.
<pre>
CREATE SCHEMA [데이터베이스명];
use [데이터베이스명];
</pre>
#### 🔸 테이블 생성
<pre>
mysql> CREATE TABLE nodejs.users(
    -> id INT NOT NULL AUTO_INCREMENT,
    -> name VARCHAR(20) NOT NULL,
    -> age INT UNSIGNED NOT NULL,
    -> married TINYINT NOT NULL,
    -> comment TEXT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> UNIQUE INDEX name_UNIQUE (name ASC))
    -> COMMENT = '사용자 정보'
    -> DEFAULT CHARSET=utf8
    -> ENGINE=InnoDB;
Query OK, 0 rows affected, 1 warning (0.03 sec)
</pre>
- 컬럼 자료형에는 `INT`(정수), `VARCHAR`(가변 길이) , `CHAR`(고정 길이), `TEXT`(긴 글), `TINYINT`(-127~128까지의 정수), `DATETIME`(날짜와 시간)
- `NULL`과 `NOT NULL`은 빈칸을 허용할지를 나타낸다.
- `AUTO_INCREMENT`는 숫자를 저절로 올리겠다는 뜻으로 1,2,3... 카운트가 올라간다.
- `UNSIGNED`는 숫자 자료형에 적용되는 옵션으로 숫자의 범위에서 음수는 무시된다.
- `ZEROFILL`은 숫자의 자릿수가 고정되어 있을 때 사용하는 것이다. (예를 들어 INT(4)일때 숫자 1을 넣는다면 0001이 된다.)
- `now()`는 현재 시간을 넣으라는 뜻이고 `now()`대신 `CURRENT_TIMESTAMP`를 적어도 된다.
- `PRIMARY KEY`는 기본키이다.
- `UNIQUE INDEX`는 해당 값이 고유해야 하는지에 대한 옵션이다.
#### 🔸 데이블 자체에 대한 설정
- `COMMENT`는 테이블에 대한 보충 설명으로 코멘트를 다는 역할이다.
- `DEFAULT CHARSET`을 utf8로 설정하지 않으면 한글이 입력되지 않으니 설정을 한다.
- `ENGINE`은 `MyISAM`과 `InnoDB`가 많이 사용된다.

#### 🔸 테이블 확인
<pre>
DESC users;
</pre>

#### 🔸 테이블 삭제
<pre>
DROP TABLE users;
</pre>

#### 🔸 댓글을 저장하는 테이블
<pre>
mysql> CREATE TABLE nodejs.comments(
    -> id INT NOT NULL AUTO_INCREMENT,
    -> commenter INT NOT NULL,
    -> comment VARCHAR(100) NOT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> INDEX commenter_idx (commenter ASC),
    -> CONSTRAINT commenter
    -> FOREIGN KEY (commenter)
    -> REFERENCES nodejs.users (id)
    -> ON DELETE CASCADE
    -> ON UPDATE CASCADE)
    -> COMMENT = '댓글'
    -> DEFAULT CHARSET=utf8
    -> ENGINE=InnoDB;
Query OK, 0 rows affected, 1 warning (0.03 sec)
</pre>
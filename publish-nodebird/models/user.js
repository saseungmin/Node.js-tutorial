module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(15),
        // null 허용
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // provider가 local이면 로컬 로그인을 한 것이고, kakao면 카카오 로그인을 한 것이다.
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        // default 값
        defaultValue: 'local',
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      //테이블을 생성한 후 자동적으로 createdAt, updatedAt column을 생성
      timestamps: true,
      //paranoid가 true이면 deletedAt column이 table에 추가된다.
      //해당 row를 삭제시 실제로 데이터가 삭제되지 않고 deletedAt에 삭제된 날짜가 추가되며 deletedAt에 날짜가 표기된 row는 find작업시 제외된다.
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  );
};

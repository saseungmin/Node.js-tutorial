module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      // 이메일
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      // 닉네임
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      // 비밀번호
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // 보유 자금
      money: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
};

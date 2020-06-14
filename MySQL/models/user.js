// 시퀄라이즈는 알아서 id를 기본 키로 연결하므로 id 칼럼은 적을 필요가 없다.
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};

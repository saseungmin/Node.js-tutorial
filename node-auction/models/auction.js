module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'auction',
    {
      // 입찰가
      bid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // 입찰 시 메시지
      msg: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
};

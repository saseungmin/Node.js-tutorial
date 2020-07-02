module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'good',
    {
      // 상품명
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      // 상품 이미지
      img: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      // 시작 가격
      price: {
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

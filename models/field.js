"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Board, Field_Datatype }) {
      this.belongsTo(Board, { foreignKey: "boardId" });
      this.belongsTo(Field_Datatype, { foreignKey: "datatypeId" });
    }
  }
  Field.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descriptions: DataTypes.STRING,
      order: {
        type: DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "Fields",
      modelName: "Field",
    }
  );
  return Field;
};

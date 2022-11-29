"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Board, Field }) {
      this.belongsTo(Board, { foreignKey: "boardId", onDelete: "CASCADE" });
    }
  }
  Item.init(
    {
      descriptions: DataTypes.STRING,
      order: {
        type: DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "Items",
      modelName: "Item",
    }
  );
  return Item;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Item, Field }) {
      // Board has many Item
      this.hasMany(Item, { foreignKey: "boardId", onDelete: "CASCADE" });
      // Board has many Field
      this.hasMany(Field, { foreignKey: "boardId", onDelete: "CASCADE" });
    }
  }
  Board.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Board",
    }
  );
  return Board;
};

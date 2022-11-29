"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemField extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Field, Item }) {
      // define association here
      Item.belongsToMany(Field, {
        through: "ItemField",
        foreignKey: "itemId",
      });

      Field.belongsToMany(Item, {
        through: "ItemField",
        foreignKey: "fieldId",
      });
    }
  }
  ItemField.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ItemField",
    }
  );
  return ItemField;
};

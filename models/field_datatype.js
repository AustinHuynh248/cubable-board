"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Field_Datatype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Field }) {
      this.hasMany(Field, { foreignKey: "datatypeId", onDelete: "CASCADE" });
    }
  }
  Field_Datatype.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Field_Datatypes",
      modelName: "Field_Datatype",
    }
  );
  return Field_Datatype;
};

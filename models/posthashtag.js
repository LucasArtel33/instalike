'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posthashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Posthashtag.belongsTo(models.Post)
      Posthashtag.belongsTo(models.Hashtag)
    }
  };
  Posthashtag.init({
  }, {
    sequelize,
    modelName: 'Posthashtag',
  });
  return Posthashtag;
};
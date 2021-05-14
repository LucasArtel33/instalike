'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      Post.hasMany(models.Comment);
      Post.belongsToMany(models.Hashtag, {through: models.Posthashtag});
      Post.hasMany(models.Posthashtag);
      Post.hasMany(models.Comment);
      Post.hasMany(models.Like);
    }
  };
  Post.init({
    image:{
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type:DataTypes.STRING,
      allowNull: false
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
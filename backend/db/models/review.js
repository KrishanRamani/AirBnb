'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    // toSafeObject() {
    //   const { id, review, stars, user_id, spot_id } = this; // context will be the User instance
    //   return { id, review, stars, user_id, spot_id };
    // }
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'spot_id'
      });
      Review.hasMany(models.Image, {
        foreignKey: 'image_id',
        constraints: false,
        scope: {
          image_type: 'Review'
        }
      });
    }
  }
  Review.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     len: [3, 256]
    //   }
    // },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    spot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
    },
    review: {
      type: DataTypes.STRING(255),
      allowNull: false,
      onDelete: 'CASCADE'
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};

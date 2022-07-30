'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    // toSafeObject() {
    //   const { id, image_id, image_type, url } = this; // context will be the User instance
    //   return { id, image_id, image_type, url };
    // }

    static associate(models) {
      Image.belongsTo(models.Spot,
        {
          foreignKey: 'image_id',
          constraints: false,
        }
      );
      Image.belongsTo(models.Review, {
        foreignKey: 'image_id',
        constraints: false
      });
    }

  }
  Image.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     len: [3, 256]
    //   }
    //},
    image_id: {
      type: DataTypes.INTEGER,
      //allowNull: false,
      //onDelete: 'CASCADE'
    },
    image_type: {
      type: DataTypes.STRING(50),
      //allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope: {
      attributes: {
        exclude: ['image_type', 'createdAt', 'updatedAt']
      }
    }
  });

  return Image;
};


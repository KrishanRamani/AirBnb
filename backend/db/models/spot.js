'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    // toSafeObject() {
    //   const { id, address, city, state, country,
    //     lat, lng, user_id, name, price, owner_id } = this; // context will be the User instance
    //   return {
    //     id, address, city, state, country,
    //     lat, lng, user_id, name, price, owner_id
    //   };
    // }
    static associate(models) {
      Spot.hasMany(models.Image, {
        foreignKey: 'image_id',
        constraints: false,
      });
      Spot.hasMany(models.Booking, {
        foreignKey: 'spot_id'
      });
      Spot.belongsTo(models.User, {
        foreignKey: 'owner_id'
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spot_id'
      });
    }

  }
  Spot.init(
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false
        // validate: {
        //   len: [3, 256]
        // }
      },
      city: {
        type: DataTypes.STRING(30),
        allowNull: false,
        // validate: {
        //   len: [3, 256]
        // }
      },
      state: {
        type: DataTypes.STRING(30),
        allowNull: false,
        // validate: {
        //   len: [3, 256]
        // }
      },
      country: {
        type: DataTypes.STRING(30),
        allowNull: false,
        // validate: {
        //   len: [3, 256]
        // }
      },
      lat: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
      },
      lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
      },
      // user_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        // validate: {
        //   len: [3, 256]
        // }
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL,
        validate: {
          isNumeric: {
            args: true,
            msg: "Price must be numeric"
          }
        }
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
        //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
        //defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      preview_image: {
        type: DataTypes.STRING,
        //allowNull: true
      },
    }, {
    scopes: {
      details() {
        return {
          attributes: {
          }
        }
      },
      byReviews() {
        return {
          attributes: {
            exclude: ['preview_image','description', 'createdAt', 'updatedAt']
          }
        }
      },
      byBookings() {
        return {
          attributes: {
            exclude: ['description', 'createdAt', 'updatedAt']
          }
        }
      },
      hideImage() {
        return {
          attributes: {
            exclude: ['preview_image']
          }
        }
      }
    },
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

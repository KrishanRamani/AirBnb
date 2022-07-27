'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    // toSafeObject() {
    //   const { user_id, spot_id, start_date, end_date } = this; // context will be the User instance
    //   return { user_id, spot_id, start_date, end_date };
    // }

    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spot_id'
      });
      Booking.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    }
  }



  Booking.init({
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
      // validate: {
      //   len: [3, 256]
      // }
    },
    spot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE'
      // validate: {
      //   len: [3, 256]
      // }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Booking',
    scopes: {
      notOwner() {
        return {
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt', 'user_id']
          }
        };
      }
    }
  });
  return Booking;
};

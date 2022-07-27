'use strict';
const {
  Model,
  Validator
} = require('sequelize');

const bcrypt = require('bcryptjs');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, email } = this; // context will be the User instance
      return { id, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    static async login({ email, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            email: email
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async login({ email, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            email: email
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ firstname, lastname, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstname,
        lastname,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    };

    static associate(models) {
      User.hasMany(models.Booking, {
        foreignKey: 'user_id'
      });
      User.hasMany(models.Review, {
        foreignKey: 'user_id'
      });
    }
  }



  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          // isNotEmail(value) {
          //   if (Validator.isEmail(value)) {
          //     throw new Error("Cannot be an email.");
          //   }
          // }
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          // isNotEmail(value) {
          //   if (Validator.isEmail(value)) {
          //     throw new Error("Cannot be an email.");
          //   }
          // }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: {
            args: true,
            msg: 'E-mail must be in an e-mail format'
          }
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
    sequelize,
    modelName: "User",
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentUser() {
        return {
          attributes: {
            exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
          }
        }
      },

      loginUser() {
        return {
          attributes: {}
        }
      }
    }
  });
  return User;
};
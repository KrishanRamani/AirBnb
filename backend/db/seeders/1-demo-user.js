'use strict';
const bcrypt = require("bcryptjs");
const { User } = require('../models');

const users = [
  {
    email: 'demo@user.io',
    firstname: 'Demo',
    lastname: 'Lition',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'user1@user.io',
    firstname: 'Fake1',
    lastname: 'Khalifa',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    email: 'user2@user.io',
    firstname: 'Fake2',
    lastname: 'Mial',
    hashedPassword: bcrypt.hashSync('password3')
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', users
      , {});
  },
  //   for (let user_info of users) {
  //     const {
  //       firstname,
  //       lastname,
  //       email,
  //       hashedPassword
  //     } = user_info;

  //     await User.create({
  //       firstname,
  //       lastname,
  //       email,
  //       hashedPassword
  //     });
  //   }
  // },

  down: async (queryInterface, Sequelize) => {
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users');
    //   firstname: { [Op.in]: ['Demo', 'Fake1', 'Fake2'] },
    //   lastname: { [Op.in]: ['Lition', 'Khalifa', 'Mia'] }
    // }, 
    //{});
  }
};

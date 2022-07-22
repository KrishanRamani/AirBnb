'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
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
        lastname: 'Mia',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      firstname: { [Op.in]: ['Demo', 'Fake1', 'Fake2'] },
      lastname: { [Op.in]: ['Lition', 'Khalifa', 'Mia'] }
    }, {});
  }
};

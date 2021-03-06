'use strict';
const { Booking, User, Spot } = require('../models');
const moment = require('moment-timezone');
const today = moment.utc().format('YYYY-MM-DD HH:mm:ss');
const bookings = [
  {
    start_date: today,
    end_date: today
  }
];


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.bulkInsert('Images', [
    //   {
    //     id: '1',
    //     image_id: '1',
    //     image_type: "Review",
    //     url: "image url",
    //   }
    // ], {});
    for (let booking_info of bookings) {
      const {
        start_date,
        end_date
      } = booking_info;

      const user = await User.findByPk(1);
      const spot = await Spot.findByPk(1);
      await Booking.create({
        spot_id: spot.id,
        user_id: user.id,
        start_date,
        end_date
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    //const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Images');
    //, {
    //firstname: { [Op.in]: ['Demo', 'Fake1', 'Fake2'] },
    //lastname: { [Op.in]: ['Lition', 'Khalifa', 'Mia'] }
    //}, {});
  }
};
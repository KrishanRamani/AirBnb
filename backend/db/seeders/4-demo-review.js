'use strict';
const { Review, User, Spot } = require('../models');

const reviews = [
  {
    review: "It was awesome!",
    stars: 4,
    user_id: 1
  },
  //{
  //   review: "Review 2",
  //   stars: 3,
  //   user_id: 1
  // },
  {
    review: "Review 3",
    stars: 2,
    user_id: 2
  },
  {
    review: "Review 4",
    stars: 1,
    user_id: 3
  },
  {
    review: "Review 5",
    stars: 5,
    user_id: 4
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Reviews', reviews
      , {});
    // for (let review_info of reviews) {
    //   const {
    //     review,
    //     stars
    //   } = review_info;

    //   const user = await User.findByPk(1);
    //   const spot = await Spot.findByPk(1);

    //   await user.createReview({
    //     user_id: user.id,
    //     spot_id: spot.id,
    //     review,
    //     stars
    //   });

  },


  down: async (queryInterface, Sequelize) => {
    //const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Reviews');
    //, {
    //firstname: { [Op.in]: ['Demo', 'Fake1', 'Fake2'] },
    //lastname: { [Op.in]: ['Lition', 'Khalifa', 'Mia'] }
    //}, {});
  }
};
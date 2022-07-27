'use strict';
const { Spot } = require('../models');

const spots = [
  {
    //id: 1,
    owner_id: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where app developers are created",
    price: 123,
    preview_image: "image url"
  },
  {
    owner_id: 2,
    address: '1406 Pine St',
    city: 'Chino',
    state: 'New Jersey',
    country: 'United States of America',
    lat: 120.2510045,
    lng: -50.2541234,
    name: 'FlatIron',
    description: "Place where web developers are created",
    price: 200,
    preview_image: "image url 2"
  }

];


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // try {
    await queryInterface.bulkInsert('Spots', spots

      , {});
    // }
    // catch (e) {
    //   console.error(e);
    // }

    // for (let spot_info of spots) {
    //   const {
    //     //id,
    //     address,
    //     city,
    //     state,
    //     country,
    //     lat,
    //     lng,
    //     name,
    //     description,
    //     price,
    //     preview_image
    //   } = spot_info;

    //   const owner_id = spots.findIndex(spot => spot === spot_info) + 1

    //   await Spot.create({
    //     owner_id,
    //     address,
    //     city,
    //     state,
    //     country,
    //     lat,
    //     lng,
    //     name,
    //     description,
    //     price,
    //     preview_image
    //   });
    // }
  },

  down: async (queryInterface, Sequelize) => {
    //const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Spots');
    //, {
    //firstname: { [Op.in]: ['Demo', 'Fake1', 'Fake2'] },
    //lastname: { [Op.in]: ['Lition', 'Khalifa', 'Mia'] }
    //}, {});
  }
};

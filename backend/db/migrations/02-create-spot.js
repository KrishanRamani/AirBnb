'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // id: {
      //   type: Sequelize.STRING(16),
      //   allowNull: false
      // },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL(10,7),
        //allowNull: false
      },
      lng: {
        type: Sequelize.DECIMAL(10,7),
        //allowNull: false
      },
      // user_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false
      // },
      name: {
        type: Sequelize.STRING(30),
        //allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        //allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        //allowNull: false
      },
      owner_id: {
        type: Sequelize.INTEGER,
        //allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      preview_image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        // references: {
        //   model : "Users",
        // } 
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};
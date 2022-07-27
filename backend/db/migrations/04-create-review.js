'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      review: {
        type: Sequelize.INTEGER(255),
        //allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
        //allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER(30),
        allowNull: false,
        references: {
          model : "Users",
        } 
      },
      spot_id: {
        type: Sequelize.INTEGER(30),
        allowNull: false,
        references: {
          model : "Spots",
        } 
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Reservations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      playerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: "Users"}
      },
      gameId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {model: "Games"}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      ...['setter','middle','rightSide','outside','libero','twos','fours','sixes'].reduce((pojo, bool)=>{
        return {...pojo, [bool]: {allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false}};
      }, {}),
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Reservations');
  }
};

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("GameTypes", {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      name: {allowNull: false, type: Sequelize.TEXT},
      bools: {allowNull: true, type: Sequelize.TEXT},
      skills: {allowNull: false, type: Sequelize.TEXT},
      ...["createdAt", "updatedAt"].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}});
      }, {})
    });
  },
  down: queryInterface => queryInterface.dropTable('GameTypes')
};

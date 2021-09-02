'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Sports", {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      Name: {allowNull: false, type: Sequelize.TEXT},
      bools: {allownull: true, type: Sequelize.TEXT},
      // sizes: {allowNull: true, type: Sequelize.TEXT},
      skills: {allowNull: false, type: Sequelize.TEXT,
        // defaultValue: JSON.stringify(["beginner", "intermediate", "advanced"])
      },
      ...["createdAt", "updatedAt"].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}});
      }, {})
    });
  },
  down: queryInterface => queryInterface.dropTable('Sports')
};

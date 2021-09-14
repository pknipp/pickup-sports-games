'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Events", {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      favoriteId: {allowNull: false, type: Sequelize.INTEGER, onDelete: 'CASCADE', references: {model: "Favorites"}},
      Location: {allowNull: false, type: Sequelize.TEXT},
      ['Extra info']: {type: Sequelize.TEXT},
      dateTime: {type: Sequelize.DATE, allowNull: false},
      ...['Minimum skill', 'Maximum skill'].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: Sequelize.INTEGER}});
      }, {}),
      ...["createdAt", "updatedAt"].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}});
      }, {})
    });
  },
  down: queryInterface => queryInterface.dropTable('Events')
};

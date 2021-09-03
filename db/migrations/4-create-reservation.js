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
      ['Extra info']: {type: Sequelize.TEXT},
      // bools: {allowNull: false, type: Sequelize.INTEGER},
      boolVals: {allowNull: false, type: Sequelize.TEXT},
      ...[['playerId', 'Users'], ['eventId', "Events"]].reduce((pojo, fk) => {
        return {...pojo, [fk[0]]: {
          allowNull: false,
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {model: `${fk[1]}`}
        }}
      }, {}),
      ...['createdAt', 'updatedAt'].reduce((pojo, date) => {
        return {...pojo, [date]: {type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}};
      }, {}),
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Reservations')
};

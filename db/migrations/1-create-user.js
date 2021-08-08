'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Email: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
      },
      Nickname: {
        allowNull: false,
        type: Sequelize.STRING(32),
        unique: true
      },
      ...['First name', 'Last name', 'Address'].reduce((pojo, key) => {
        return {...pojo, [key]: {allowNull: false, type: Sequelize.STRING(63)}};
      }, {}),
      Cell: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      // skill: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      // },
      Photo: {
        type: Sequelize.TEXT,
      },
      tokenId: {
        type: Sequelize.STRING(36),
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING(60).BINARY,
      },
      ...['Created at', 'Updated at'].reduce((pojo, date) => {
        return {...pojo, [date]: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}};
      }, {})
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Users')
};

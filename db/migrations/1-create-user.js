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
      email: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
      },
      nickName: {
        allowNull: false,
        type: Sequelize.STRING(32),
        unique: true
      },
      ...['firstName', 'lastName', 'address'].reduce((pojo, key) => {
        return {...pojo, [key]: {allowNull: false, type: Sequelize.STRING(63)}};
      }, {}),
      cell: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      skill: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      photo: {
        type: Sequelize.TEXT,
      },
      tokenId: {
        type: Sequelize.STRING(36),
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING(60).BINARY,
      },
      ...['createdAt', 'updatedAt'].reduce((pojo, date) => {
        return {...pojo, [date]: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}};
      }, {})
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Users')
};

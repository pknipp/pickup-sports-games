'use strict';
const {Model, INTEGER} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Reservation",
    {
      ...['playerId','gameId'].reduce((pojo, fk) => {
        return {...pojo, [fk]: {type: DataTypes.INTEGER, allowNull: false}};
      }, {}),
      ...['genderBools', 'positionBools', 'sizeBools'].reduce((pojo, key) => {
        return {...pojo, [key]: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}}
      }, {}),
      // bools: {allowNull: false, defaultValue: 0, type: DataTypes.INTEGER},
      ['Extra info']: {allowNull: true, type: DataTypes.TEXT},
    },
  );

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Game, {foreignKey: 'gameId', onDelete: 'CASCADE'});
    Reservation.belongsTo(models.User, {foreignKey: 'playerId', onDelete: 'CASCADE'});
  };

  return Reservation;
};

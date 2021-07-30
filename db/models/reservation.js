'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Reservation",
    {
      ...['playerId','gameId'].reduce((pojo, fk) => {
        return {...pojo, [fk]: {type: DataTypes.INTEGER, allowNull: false}};
      }, {}),
      ...['setter','middle','rightSide','outside','libero','twos','fours','sixes'].reduce((pojo, bool) => {
        return {...pojo, [bool]: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}};
      }, {}),
      extraInfo: {allowNull: true, type: DataTypes.TEXT}
    },
  );

  Reservation.associate = function(models) {
    Reservation.belongsTo(models.Game, {foreignKey: 'gameId', onDelete: 'CASCADE'});
    Reservation.belongsTo(models.User, {foreignKey: 'playerId', onDelete: 'CASCADE'});
  };

  return Reservation;
};

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      playerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      gameId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      ...['setter','middle','rightSide','outside','libero','twos','fours','sixes'].reduce((pojo, bool) => {
        return ...pojo, [bool]: {type: DataTypes.BOOLEAN}})
    },
  );

  Reservation.associate = function(models) {};

  return Reservation;
};

'use strict';

module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    "Game",
    {
      ownerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      address: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      dateTime: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      minSkill: {
        type: DataTypes.INTEGER,
      },
      maxSkill: {
        type: DataTypes.INTEGER,
      },
      extraInfo: {
        type: DataTypes.TEXT,
      }
    },
  );

  Game.associate = function(models) {};

  return Game;
};

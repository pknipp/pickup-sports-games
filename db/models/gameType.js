'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const GameType = sequelize.define(
    "GameType",
    {
      name: {allowNull: false, type: DataTypes.TEXT},
      bools: {allowNull: true, type: DataTypes.TEXT},
      skills: {allowNull: false, type: DataTypes.TEXT},
    },
  );

  GameType.associate = function(models) {
    Game.hasMany(models.Game, {foreignKey: 'gameTypeId'});
  };

  return Game;
};

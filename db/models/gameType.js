'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const GameType = sequelize.define(
    "GameType",
    {
      ['Sport']: {allowNull: false, type: DataTypes.TEXT},
      positions: {allowNull: true, type: DataTypes.TEXT},
      skills: {allowNull: false, type: DataTypes.TEXT},
      sizes: {allowNull: true, type: DataTypes.TEXT},
    },
  );

  GameType.associate = function(models) {
    GameType.hasMany(models.Game, {foreignKey: 'gameTypeId'});
  };

  return GameType;
};

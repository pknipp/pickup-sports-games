'use strict';

module.exports = (sequelize, DataTypes) => {
  let bools = ['setter', 'middle', 'rightSide', 'outside', 'libero', 'twos', 'fours', 'sixes'];
  const Game = sequelize.define(
    "Game",
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      gameId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      bools.reduce((pojo, bool) => {...pojo, bool: {type: DataTypes.BOOLEAN}})
    },
  );

  Game.associate = function(models) {};

  return Game;
};

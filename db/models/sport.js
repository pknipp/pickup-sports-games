'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Sport = sequelize.define(
    "Sport",
    {
      Name: {allowNull: false, type: DataTypes.TEXT},
      boolTypes: {allowNull: false, type: DataTypes.TEXT},
      skills: {allowNull: false, type: DataTypes.TEXT},
    },
  );

  Sport.associate = function(models) {
    Sport.hasMany(models.Event, {foreignKey: 'sportId'});
  };

  return Sport;
};

'use strict';
const {Model, INTEGER} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define("Skill",
    {
      ...['userId','gameTypeId'].reduce((pojo, fk) => {
        return {...pojo, [fk]: {type: DataTypes.INTEGER, allowNull: false}};
      }, {}),
    },
  );
  Skill.associate = function(models) {
    Skill.belongsTo(models.GameType, {foreignKey: 'gameTypeId', onDelete: 'CASCADE'});
    Reservation.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
  };
  return Skill;
};

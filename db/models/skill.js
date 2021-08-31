'use strict';
const {Model, INTEGER} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define("Skill",
    {
        ...['userId','sportId'].reduce((pojo, fk) => {
            return {...pojo, [fk]: {type: DataTypes.INTEGER, allowNull: false}};
        }, {}),
        skill: {allowNull: false, type: DataTypes.INTEGER},
    },
  );
  Skill.associate = function(models) {
    Skill.belongsTo(models.Sport, {foreignKey: 'sportId', onDelete: 'CASCADE'});
    Skill.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
  };
  return Skill;
};

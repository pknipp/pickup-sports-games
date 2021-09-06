'use strict';
const {Model, INTEGER} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define("Favorite",
    {
        ...['userId','sportId'].reduce((pojo, fk) => {
            return {...pojo, [fk]: {type: DataTypes.INTEGER, allowNull: false}};
        }, {}),
        skill: {allowNull: false, type: DataTypes.INTEGER},
    },
  );
  Favorite.associate = function(models) {
    Favorite.belongsTo(models.Sport, {foreignKey: 'sportId', onDelete: 'CASCADE'});
    Favorite.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
  };
  return Favorite;
};

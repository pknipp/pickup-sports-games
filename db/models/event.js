'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      favoriteId: {allowNull: false, type: DataTypes.INTEGER},
      ...['Minimum skill', 'Maximum skill'].reduce((pojo, key) => {
        return ({...pojo, [key]: {allowNull: false, type: DataTypes.INTEGER}});
      }, {}),
      Location: {allowNull: false, type: DataTypes.TEXT},
      ["Extra info"]: {allowNull: true, type: DataTypes.TEXT},
      dateTime: {allowNull: false, type: DataTypes.DATE}
    },
  );

  Event.associate = function(models) {
    Event.hasMany(models.Reservation, {foreignKey: 'eventId'});
    Event.belongsTo(models.Favorite, {foreignKey: 'favoriteId', onDelete: 'CASCADE'});
  };

  return Event;
};

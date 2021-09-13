'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { favorites } = require('./3-insert-favorites');
const { events } = require('./4-insert-events');
const { reservationProb, extraInfos } = require('../seederData/reservations');

let reservations = [];
events.forEach((event, i) => {
  let favorite = favorites[event.favoriteId - 1];
  let sport = sports[favorite.sportId - 1];
  for (let userId = 1; userId <= numberOfUsers; userId++) {
    if (favorites.filter(fav => fav.userId === userId && fav.sportId === favorite.sportId).length) {
      if (Math.random() < reservationProb) {
        const reservation = {userId, eventId: i + 1};
        reservation.boolVals = Object.keys(sport.boolTypes).reduce((pojo, key) => {
          return {...pojo, [key]: 1 + Math.floor(Math.random() * (2 ** sport.boolTypes[key].length - 1))};
        }, {genders: 1 + Math.floor(Math.random() * (2 ** 4 - 1))});
        reservation.boolVals = JSON.stringify(reservation.boolVals);
        let updatedAt = faker.date.past(0.1);
        if (Math.random() < reservationProb) {
          reservation['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
        };
        [reservation.createdAt, reservation.updatedAt] = [faker.date.past(0.1, updatedAt), updatedAt];
        reservations.push(reservation);
      }
    }
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Reservations', reservations),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

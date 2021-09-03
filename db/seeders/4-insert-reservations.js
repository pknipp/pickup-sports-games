'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { events } = require('./3-insert-events');
const { reservationProb, extraInfos } = require('../seederData/reservations');

let reservations = [];
events.forEach((event, i) => {
  let sport = sports[event.sportId - 1];
  for (let playerId = 1; playerId <= numberOfUsers; playerId++) {
    if (Math.random() < reservationProb) {
      const reservation = {playerId, eventId: i + 1};
      reservation.bools = Object.keys(sport.bools).reduce((pojo, key) => {
        return {...pojo, [key]: 1 + Math.floor(Math.random() * (2 ** sport.bools[key].length - 1))};
      }, {genders: 1 + Math.floor(Math.random() * (2 ** 4 - 1))});
      reservation.bools = JSON.stringify(reservation.bools);
      let updatedAt = faker.date.past(0.1);
      if (Math.random() < reservationProb) {
        reservation['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
      };
      [reservation.createdAt, reservation.updatedAt] = [faker.date.past(0.1, updatedAt), updatedAt];
      reservations.push(reservation);
    }
  }
})

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Reservations', reservations),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

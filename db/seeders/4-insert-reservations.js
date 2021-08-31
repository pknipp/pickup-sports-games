'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { events } = require('./3-insert-events');
const { reservationProb, extraInfos } = require('../seederData/reservations');

let reservations = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let i = 0; i < events.length; i++) {
    if (Math.random() < reservationProb) {
      const reservation = {playerId: 1 + iUser, eventId: i + 1};
      let sport = sports[events[i].sportId - 1];
      // Why is JSON.parse needed in the following?
      let gendersLength = 4;
      let positionsLength =  sport.positions ? JSON.parse(sport.positions).length : 0;
      let sizesLength = sport.sizes ? JSON.parse(sport.sizes).length : 0;
      reservation.genderBools = Math.floor(Math.random() * 2 ** gendersLength);
      reservation.positionBools = Math.floor(Math.random() * 2 ** positionsLength);
      reservation.sizeBools = Math.floor(Math.random() * 2 ** sizesLength);
      let updatedAt = faker.date.past(0.1);
      if (Math.random() < reservationProb) reservation['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
      [reservation.createdAt, reservation.updatedAt] = [faker.date.past(0.1, updatedAt), updatedAt];
      reservations.push(reservation);
    }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Reservations', reservations),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

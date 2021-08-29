'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { gameTypes } = require('../seederData/gameTypes');
const { games } = require('./3-insert-games');
const { reservationProb } = require('../seederData/reservations');

let reservations = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let i = 0; i < games.length; i++) {
    if (Math.random() < reservationProb) {
      const reservation = {playerId: 1 + iUser, gameId: i + 1};
      let gt = gameTypes[games[i].gameTypeId - 1];
      // Why is JSON.parse needed in the following?
      let boolsLength = 0 + (gt.positions ? JSON.parse(gt.positions).length : 0) + (gt.sizes ? JSON.parse(gt.sizes).length : 0);
      reservation.bools = Math.floor(Math.random() * 2 ** boolsLength);
      let updatedAt = faker.date.past(0.1);
      if (Math.random() < reservationProb) reservation['Extra info'] = faker.lorem.words();
      [reservation.createdAt, reservation.updatedAt] = [faker.date.past(0.1, updatedAt), updatedAt];
      reservations.push(reservation);
    }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Reservations', reservations),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

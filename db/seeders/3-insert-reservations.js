'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { numberOfGames } = require('../seederData/games');
const { reservationProb } = require('../seederData/reservations');

const bools = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];
let reservations = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let iGame = 0; iGame < numberOfGames; iGame++) {
    if (Math.random() < reservationProb) {
      let reservation = {playerId: 1 + iUser, gameId: 1 + iGame};
      bools.forEach(bool => reservation[bool] = Math.random() < 0.5);
      let updatedAt = faker.date.past(0.1);
      [reservation.createdAt, reservation.updatedAt] = [faker.date.past(0.1, updatedAt), updatedAt];
      reservations.push(reservation);
    }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Reservations', reservations),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

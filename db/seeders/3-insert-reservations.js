'use strict';
const { numberOfUsers, numberOfGames, reservationProb, miscProb } = require('../seederNumbers');

const bools = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];
let reservations = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let iGame = 0; iGame < numberOfGames; iGame++) {
    if (Math.random() < reservationProb) {
      let reservation = {playerId: 1 + iUser, gameId: 1 + iGame};
      bools.forEach(bool => reservation[bool] = Math.random() < 0.5);
      [reservation.createdAt, reservation.updatedAt] = [new Date(), new Date()];
      reservations.push(reservation);
    }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reservations', reservations);
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

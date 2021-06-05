'use strict';

function r(o) {
  o.createdAt = new Date();
  o.updatedAt = new Date();
  return o;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reservations', [
      r({
        playerId: 1,
        gameId: 1,
        setter: true,
        libero: false,
        twos: true,
        fours: false
      }),
      r({
        playerId: 1,
        gameId: 2,
        rightSide: true,
        outside: false,
        fours: true,
        sixes: false
      }),
      r({
        playerId: 2,
        gameId: 1,
        middle: true,
        twos: true,
        sixes: true
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reservations');
  }
};

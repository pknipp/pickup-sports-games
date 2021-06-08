'use strict';

function r(o) {
  [o.createdAt, o.updatedAt] = [new Date(), new Date()];
  const bools = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];
  // PAK does not know why following line is necessary, given use of defaultValue in model and migration files.
  bools.forEach(bool => o[bool] = (o[bool] == null) ? false : o[bool]);
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

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

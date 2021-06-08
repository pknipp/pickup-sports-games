'use strict';

const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Games', [
      r({ownerId: 1, address: "Long Beach, CA", minSkill: 2, maxSkill: 4}),
      r({ownerId: 2, address: "Ocean City, MD", extraInfo: "Casual game"}),
    ]);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Games')
};

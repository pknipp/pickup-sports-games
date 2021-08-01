'use strict';
const { gameTypes } = require('../seederData/gameTypes');

const r = o => ({...o,
    createdAt: new Date(),
    updatedAt: new Date(),
    bools: JSON.stringify(o.bools),
    skills: JSON.stringify(o.skills),
});

for (let i = 0; i < gameTypes.length; i++) {
    gameTypes[i] = r(gameTypes[i]);
};

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('GameTypes', gameTypes),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('GameTypes')
};

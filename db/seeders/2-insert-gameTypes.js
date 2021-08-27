'use strict';
const { gameTypes } = require('../seederData/gameTypes');

const r = o => ({...o,
    createdAt: new Date(),
    updatedAt: new Date(),
    // ...(["positions", "skills", "sizes"].map(prop => ([prop]: JSON.stringify(o[prop]))),
    positions: JSON.stringify(o.positions),
    skills: JSON.stringify(o.skills || ["beginner", "intermediate", "advanced"]),
    sizes: JSON.stringify(o.sizes),
});

for (let i = 0; i < gameTypes.length; i++) {
    gameTypes[i] = r(gameTypes[i]);
}; 
gameTypes.sort((a, b) => a.Sport < b.Sport ? -1 : a.Sport > b.Sport ? 1 : 0);

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('GameTypes', gameTypes),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('GameTypes')
};

'use strict';
const { sports } = require('../seederData/sports');

const r = o => ({...o,
    createdAt: new Date(),
    updatedAt: new Date(),
    // ...(["positions", "skills", "sizes"].map(prop => ([prop]: JSON.stringify(o[prop]))),
    bools: JSON.stringify(o.bools),
    skills: JSON.stringify(o.skills || ["low", "middle", "high"]),
    // sizes: JSON.stringify(o.sizes),
});

for (let i = 0; i < sports.length; i++) {
    sports[i] = r(sports[i]);
};
sports.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Sports', sports),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Sports')
};

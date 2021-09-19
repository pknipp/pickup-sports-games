'use strict';
let { sports } = JSON.parse(JSON.stringify(require('../seederData/sports')));

const r = o => ({...o,
    createdAt: new Date(),
    updatedAt: new Date(),
    boolTypes: JSON.stringify(o.boolTypes),
    Skills: JSON.stringify(o.Skills || ['beginner', 'intermediate', 'advanced', 'expert']),
    nGenders: o.nGenders === undefined ? 4 : o.nGenders,
});

sports = sports.map(sport => r(sport));
sports.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Sports', sports),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Sports')
};

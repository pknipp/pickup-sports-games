'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { skillProb } = require('../seederData/skills');

sports.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

let skills = [];
for (let userId = 1; userId <= numberOfUsers; userId++) {
  sports.forEach((sport, i) => {
    let skillsLength = sport.skills ? sport.skills.length : 3;
    let skill = (Math.random() > skillProb) ? 0 : (1 + Math.floor(Math.random() * skillsLength));
    let updatedAt = faker.date.past(0.1);
    skill = {userId, sportId: i + 1, skill, updatedAt, createdAt: faker.date.past(0.1, updatedAt)};
    skills.push(skill);
  })
  // }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', skills),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills'),
};

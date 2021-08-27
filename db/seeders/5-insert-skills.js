'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { gameTypes } = require('../seederData/gameTypes');
const { skillProb } = require('../seederData/skills');

gameTypes.sort((a, b) => a.Sport < b.Sport ? -1 : a.Sport > b.Sport ? 1 : 0);

// let n = 5
// console.log(typeof gameTypes, gameTypes.length)
// console.log(typeof gameTypes[n], gameTypes[n])
// console.log(typeof gameTypes[n].sizes, gameTypes[n].sizes && gameTypes[n].sizes.length)
// console.log(typeof gameTypes[n].skills, gameTypes[n].skills)

let skills = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let i = 0; i < gameTypes.length; i++) {
    let gt = gameTypes[i];
    // I'm baffled as to the need for the following line.
    let skillsLength = gt.skills ? JSON.parse(gameTypes[i].skills).length : 3;
    // let skillsLength = gt.skills ? gt.skills.length : 3;
    let skill = (Math.random() < skillProb) ? (1 + Math.floor(Math.random() * skillsLength)) : 0;
    let updatedAt = faker.date.past(0.1);
    skill = {userId: iUser + 1, gameTypeId: i + 1, skill, updatedAt, createdAt: faker.date.past(0.1, updatedAt)};
    skills.push(skill);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', skills),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills'),
};

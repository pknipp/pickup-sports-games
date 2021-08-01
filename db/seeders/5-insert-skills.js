'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { gameTypes } = require('../seederData/gameTypes');
const { skillProb } = require('../seederData/skills');

let skills = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let i = 0; i < gameTypes.length; i++) {
    let skillsLength = JSON.parse(gameTypes[i].skills).length;
    let skill = (Math.random() < skillProb) ? 0 : (1 + Math.floor(Math.random() * skillsLength));
    let updatedAt = faker.date.past(0.1);
    skill = {userId: iUser + 1, gameTypeId: i + 1, skill, updatedAt, createdAt: faker.date.past(0.1, updatedAt)};
    // console.log(skill);
    skills.push(skill);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Skills', skills),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Skills'),
};

'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { favoriteProb } = require('../seederData/favorites');

sports.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);

let favorites = [];
// for (let favoriteId = 0; favoriteId < numberOfFavorites; favoriteId++) {
for (let userId = 1; userId <= numberOfUsers; userId++) {
  sports.forEach((sport, i) => {
    if (Math.random() < favoriteProb) {
      let SkillsLength = sport.Skills?.length || 4;
      let Skill = Math.floor(Math.random() * SkillsLength);
      let updatedAt = faker.date.past(0.1);
      let favorite = {userId, sportId: i + 1, Skill, updatedAt, createdAt: faker.date.past(0.1, updatedAt)};
      favorites.push(favorite);
    }
  })
}

module.exports = {
  // Following property will be needed when seeding the events table.
  favorites,
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Favorites', favorites),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Favorites'),
};

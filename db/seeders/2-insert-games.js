'use strict';
const faker = require('faker');
const { numberOfUsers, numberOfGames, reservationProb, skillProb, miscProb } = require('../seederNumbers');
const { cities } = require('../cities');
const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const games = [];
for (let i = 0; i < numberOfGames; i++) {
  const game = r({
    ownerId: 1 + Math.floor(Math.random() * numberOfUsers),
    address: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.stateAbbr(),
    dateTime: faker.date.future()
  });
  if (Math.random() < skillProb) game.minSkill = 1 + Math.floor(Math.random() * 5);
  if (Math.random() < skillProb) game.maxSkill = 6 + Math.floor(Math.random() * 4);
  if (Math.random() < miscProb)  game.extraInfo = faker.lorem.words();
  games.push(game);
}

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Games', games),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Games')
};

'use strict';
const faker = require('faker');

const { numberOfUsers } = require('../seederData/users');
const { gameTypes } = require('../seederData/gameTypes');
const { numberOfGames, cities, skillProb, miscProb, extraInfos } = require('../seederData/games')

const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const games = [];
for (let i = 0; i < numberOfGames; i++) {
  const game = r({
    ownerId: 1 + Math.floor(Math.random() * numberOfUsers),
    ['Location']: cities[Math.floor(cities.length * Math.random())],
    dateTime: faker.date.future()
  });
  game['Minimum skill'] = (Math.random() < skillProb) ? 1 + Math.floor(Math.random() * 2) : 0;
  game['Maximum skill'] = (Math.random() < skillProb) ? 2 + Math.floor(Math.random() * 2) : 0;
  game.gameTypeId = 1 + Math.floor(Math.random() * gameTypes.length);
  if (Math.random() < miscProb)  game['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
  games.push(game);
}

module.exports = {
  // gameTypeId of games'll be needed when seeding Reservations
  games,
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Games', games),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Games')
};

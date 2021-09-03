'use strict';
const faker = require('faker');

const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { numberOfEvents, cities, skillProb, miscProb, extraInfos } = require('../seederData/events')

const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const events = [];
for (let i = 0; i < numberOfEvents; i++) {
  const event = r({
    ownerId: 1 + Math.floor(Math.random() * numberOfUsers),
    ['Location']: cities[Math.floor(cities.length * Math.random())],
    dateTime: faker.date.future()
  });
  event['Minimum skill'] = (Math.random() < skillProb) ? 1 + Math.floor(Math.random() * 2) : 0;
  event['Maximum skill'] = (Math.random() < skillProb) ? 2 + Math.floor(Math.random() * 2) : 0;
  event.sportId = 1 + Math.floor(Math.random() * sports.length);
  if (Math.random() < miscProb)  event['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
  events.push(event);
}
// console.log(events);

module.exports = {
  // sportId of events'll be needed when seeding Reservations
  events,
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Events', events),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Events')
};

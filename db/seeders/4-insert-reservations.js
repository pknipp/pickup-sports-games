'use strict';
const faker = require('faker');
const { numberOfUsers } = require('../seederData/users');
const { sports } = require('../seederData/sports');
const { events } = require('./3-insert-events');
const { reservationProb, extraInfos } = require('../seederData/reservations');

let reservations = [];
for (let iUser = 0; iUser < numberOfUsers; iUser++) {
  for (let i = 0; i < events.length; i++) {
    if (Math.random() < reservationProb) {
      const reservation = {playerId: 1 + iUser, eventId: i + 1};
      let sport = sports[events[i].sportId - 1];
      // Why is JSON.parse needed in the following?
      // console.log(events[i].sportId - 1, "typeof sport.bools = ", typeof sport.bools);
      sport.bools = typeof(sport.bools) === 'string' ? JSON.parse(sport.bools) : sport.bools;
      reservation.bools = Object.keys(sport.bools).reduce((pojo, key) => {
        return {...pojo, [key]: 1 + Math.floor(Math.random() * (2 ** sport.bools[key].length - 1))};
      }, {genders: 1 + Math.floor(Math.random() * (2 ** 4 - 1))});
      reservation.bools = JSON.stringify(reservation.bools);
      let updatedAt = faker.date.past(0.1);
      if (Math.random() < reservationProb) reservation['Extra info'] = extraInfos[Math.floor(Math.random() * extraInfos.length)];
      [reservation.createdAt, reservation.updatedAt] = [faker.date.past(0.1, updatedAt), updatedAt];
      reservations.push(reservation);
    }
  }
}
// console.log(reservations);

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Reservations', reservations),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Reservations')
};

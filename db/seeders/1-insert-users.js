'use strict';
const faker = require('faker');

const bcrypt = require('bcryptjs');
const { people, numberOfUsers } = require('../seederData/users');
const createPassword = () => bcrypt.hashSync('password');

const users = [{
  email: 'volleyb@aol.com',
  address: 'Philadelphia PA',
  nickName: 'Volley B',
  firstName: 'Volley',
  lastName: 'Ball'
}];

people.slice(0, numberOfUsers - 1).forEach(person => {
  const firstName = person[0];
  const updatedAt = faker.date.past(1);
  users.push({
    email: firstName[0].toLowerCase() + 'doe@aol.com',
    address: person[1],
    nickName: firstName + ' D',
    firstName,
    lastName: 'Doe',
  });
})

users.forEach(user => {
  user.cell = 10 ** 9 + Math.floor(Math.random() * 9 * 10 ** 9);
  user.skill = Math.floor(Math.random() * 10);
  user.photo = `${user.firstName}'s photoURL`;
  user.hashedPassword = createPassword();
  const updatedAt = faker.date.past(1);
  user.updatedAt = updatedAt;
  user.createdAt = faker.date.past(1, updatedAt);
  // The following line was not an adequate replacement for the previous 2 oines.
  // user = {...user, updatedAt, createdAt: faker.date.past(1, updatedAt)};
})

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', users),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users')
};

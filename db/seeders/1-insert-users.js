'use strict';

const bcrypt = require('bcryptjs');
const { numberOfUsers } = require('../seederNumbers');
const createPassword = () => bcrypt.hashSync('password');
const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

const people = [
  ['Aaron', 'Pittsburgh'],
  ['Ben', 'Denver'],
  ['Curtis', 'San Francisco'],
  ['Darius', 'Muscle Shoals'],
  ['Ed', 'Scranton'],
  ['Fred', 'Glen Rock'],
  ['Geoffrey', 'Sacramento'],
  ['Hal', 'Annapolis'],
  ['Ian', 'Brooklyn'],
  ['Javier', 'San Diego'],
  ['Krisna', 'Las Vegas'],
  ['Lauren', 'Seattle'],
  ['Mylo', 'Los Angeles'],
  ['Nick', 'Houston'],
  ['Olive', 'Baltimore'],
  ['Pete', 'Stratford'],
  ['Quincy', 'Memphis'],
  ['Rose', 'Palo Alto'],
  ['Simon', 'Boston'],
  ['Tyna', 'Miami Gardens'],
  ['Ugo', 'Chicago'],
  ['Vann', 'Hollywood'],
  ['Warren', 'Portland Oregon'],
  ['Yul', 'Severna Park'],
  ['Zachery', 'Little Rock']
];

const users = [{email: 'volleyb@aol.com', address: 'Philadelphia', nickName: 'Volley B', firstName: 'Volley', lastName: 'Ball'}];

for (const person of people) {
  let firstName = person[0];
  users.push({
    email: firstName[0].toLowerCase() + 'doe@aol.com',
    address: person[1],
    nickName: firstName + ' D',
    firstName,
    lastName: 'Doe'
  });
}

users.forEach(user => {
  user.cell = 10 ** 9 + Math.floor(Math.random() * 9 * 10 ** 9);
  user.skill = 1 + Math.floor(Math.random() * 8);
  user.photo = `${user.firstName}'s photoURL`;
  user.hashedPassword = createPassword();
  user = r(user);
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users')
};

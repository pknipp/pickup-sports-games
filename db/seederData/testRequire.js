'use strict';
const { gameTypes } = require('../seederData/gameTypes');

gameTypes.sort((a, b) => a.Sport < b.Sport ? -1 : a.Sport > b.Sport ? 1 : 0);

let n = 6
console.log(typeof gameTypes, gameTypes.length)
console.log(typeof gameTypes[n], gameTypes[n])
console.log(typeof gameTypes[n].sizes, gameTypes[n].sizes && gameTypes[n].sizes.length)
// console.log(typeof gameTypes[n].skills, gameTypes[n].skills)

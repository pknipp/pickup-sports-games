const express = require('express');
const asyncHandler = require('express-async-handler');

const { Favorite, Sport } = require('../../db/models');
const { authenticated } = require('./security-utils');

const router = express.Router();

// used in useEffects of User component & of EditEvent
router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    try {
    let userId = req.user.id;
    let favorites = (await Favorite.findAll({where: {userId}})).map(favorite => favorite.dataValues);
    for (let i = 0; i < favorites.length; i++) {
        let favorite = favorites[i];
    // Whey cannot I use the following array method for this loop?
    // favorites = favorites.map(async favorite => {
        // favorite = favorite.dataValues;
        let sport = (await Sport.findByPk(favorite.sportId)).dataValues;
        // sport.boolTypes = JSON.parse(sport.boolTypes);
        favorite.Skills = JSON.parse(sport.Skills);
        // sport.Skill = favorite.Skill;
        favorite.Name = sport.Name;
    };
    res.json({favorites});
} catch(e) {
    console.log(e)
}
}));

module.exports = router;

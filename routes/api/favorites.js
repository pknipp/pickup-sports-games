const express = require('express');
const asyncHandler = require('express-async-handler');

const { Favorite, Sport } = require('../../db/models');
const { authenticated } = require('./security-utils');

const router = express.Router();

// used in useEffect of User component
router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    let userId = req.user.id;
    let favorites = await Favorite.findAll({where: {userId}});
    let sports = [];
    // favorites.forEach(async favorite => {
    for (const favorite of favorites) {
        let sport = (await Sport.findByPk(favorite.sportId)).dataValues;
        // sport.boolTypes = JSON.parse(sport.boolTypes);
        sport.skills = JSON.parse(sport.skills);
        sport.Skill = favorite.Skill;
        sports.push(sport)
    };
    res.json({sports});
}));

module.exports = router;

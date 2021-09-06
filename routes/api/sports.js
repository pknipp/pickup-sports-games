const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Sport, Favorite } = require('../../db/models');
const { authenticated } = require('./security-utils');

const router = express.Router();

router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    let userId = req.user.id;
    let sports = (await Sport.findAll({})).map(sport => sport.dataValues);
    for (let i = 0; i < sports.length; i++) {
        let sport = sports[i];
        sport.Skill = (await Favorite.findOne({where: {userId, sportId: sport.id}})).skill;
        sport.boolTypes = JSON.parse(sport.boolTypes);
        sport.skills = JSON.parse(sport.skills);
    };
    res.json({sports});
}));

module.exports = router;

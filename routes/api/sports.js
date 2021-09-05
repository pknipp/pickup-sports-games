const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { Sport, Skill } = require('../../db/models');
const { authenticated } = require('./security-utils');

const router = express.Router();

router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    let userId = req.user.id;
    let sports = (await Sport.findAll({})).map(sport => sport.dataValues);
    for (let i = 0; i < sports.length; i++) {
        let sport = sports[i];
        let sportId = sport.id;
        sport.boolTypes = JSON.parse(sport.boolTypes);
        let skill = await Skill.findOne({where: {userId, sportId}});
        sport.Skill = Number(skill) && skill.dataValues.skill;
    };
    res.json({sports});
}));

module.exports = router;

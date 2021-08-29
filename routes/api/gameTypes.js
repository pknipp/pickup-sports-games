const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { GameType, Skill } = require('../../db/models');
const { authenticated } = require('./security-utils');

const router = express.Router();

router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    let userId = req.user.id;
    let gameTypes = (await GameType.findAll({})).map(gameType => gameType.dataValues);
    for (let i = 0; i < gameTypes.length; i++) {
        let gT = gameTypes[i];
        let gameTypeId = gT.id;
    // gameTypes.forEach(async (gameType, index) => {
        ['skills', 'sizes', 'positions'].forEach(key => {
            let val = gT[key];
            gT[key] = val && JSON.parse(val);
        });
        gT.Skill = (await Skill.findOne({where: {userId, gameTypeId}})).dataValues.skill;
    };
    res.json({gameTypes});
}));

module.exports = router;

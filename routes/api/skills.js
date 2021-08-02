const express = require('express');
const asyncHandler = require('express-async-handler');
const faker = require('faker');
const { Op } = require('sequelize');
const fetch = require('node-fetch');

const { Game, Reservation, User, GameType, Skill } = require("../../db/models");
const { authenticated } = require('./security-utils');
const gameType = require('../../db/models/gameType');

const router = express.Router();
// const bools = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];

router.get('', [authenticated], asyncHandler(async (req, res, next) => {
    const gameTypes = [];
    for (let skill of await Skill.findAll({where: {userId: req.user.id}})) {
        let gameType = (await GameType.findByPk(skill.gameTypeId)).dataValues;
        gameTypes.push({...gameType, skills: JSON.parse(gameType.skills), skill: skill.skill});
    }
    res.json({gameTypes});
}));

module.exports = router;

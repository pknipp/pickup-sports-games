const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { GameType } = require('../../db/models');

const router = express.Router();

router.get('', asyncHandler(async(req, res, next) => {
    // transform Query return to an array of pojos, to enable us to attach properties to each
    let gameTypes = await GameType.findAll({});
    gameTypes = gameTypes.map(gameType => gameType.dataValues);
    // console.log("gameTypes = ", gameTypes);
    res.json({gameTypes});
}));

module.exports = router;

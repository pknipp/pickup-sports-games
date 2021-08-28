const express = require('express');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

const { GameType } = require('../../db/models');

const router = express.Router();

router.get('', asyncHandler(async(req, res, next) => {
    let gameTypes = (await GameType.findAll({})).map(gameType => gameType.dataValues);
    gameTypes.forEach((gameType, index) => {
        // Why cannot I use the following pattern to DRY this code?
        // ['skills', 'sizes', 'positions'].forEach(key => {
        //     let val = gameType[key];
        //     val = val && JSON.parse(val);
        // });
        gameType.skills = gameType.skills && JSON.parse(gameType.skills);
        gameType.sizes = gameType.sizes && JSON.parse(gameType.sizes);
        gameType.positions = gameType.positions && JSON.parse(gameType.positions);
    });
    res.json({gameTypes});
}));

module.exports = router;

const express = require('express');
const router = express.Router();
const { Game } = require("../../db/models");
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');

router.get('/:lat/:long/:radius', async (req, res) => {
    const games = await Game.findAll({

    })
});

router.post('/', asyncHandler(async (req, res, next) => {
    const {
        ownerId,
        address,
        dateTime,
        minSkill,
        maxSkill,
        extraInfo,
    } = req.body;
    console.log(req.body)
    try {
        const game = await Game.create({
            ownerId,
            address,
            dateTime,
            minSkill,
            maxSkill,
            extraInfo
        })
        // const game = await Game.create(req.body);

        res.status(201).send(game)
    } catch (e) {
        res.status(400).send(e)
    }
}));

router.put('/:id', async (req, res) => {
    const userId = req.body.id;
    const game = await Game.findOne({ id: req.params.id })

    if (game.ownerId !== userId) {
        res.status(401).send("Unauthorized Access");
    }

    game.address = req.body.address;
    game.dateTime = req.body.dateTime;
    game.minSkill = req.body.minSkill;
    game.maxSkill = req.body.maxSkill;
    game.extraInfo = req.body.extraInfo;
    //Object.entries(req.body).forEach([key, value] => game[key] = value || game[key]);

    await game.save();
    res.status(400).json(game);

})

module.exports = router;

const express = require('express');
const router = express.Router();
const { Game } = require("../../db/models");
const { Op } = require('sequelize');

router.get('/:lat/:long/:radius', async (req, res) => {
    const games = await Game.findAll({

    })
});

router.post('/', async (req, res) => {
    const {
        ownerId,
        address,
        dateTime,
        minSkill,
        maxSkill,
        extraInfo,
    } = req.body;

    try {
        const game = await Game.create({
            ownerId,
            address,
            dateTime,
            minSkill,
            maxSkill,
            extraInfo
        })

        res.status(201).send(game)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/:id', async (req, res) => {

    const game = await Game.findOne({ id: req.params.id, })

    const updates = Object.keys(req.body);

    if (game.ownerId !== ownerId) {
        res.status(401).send("Unauthorized Access");
    }


})
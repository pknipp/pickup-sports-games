const express = require('express');
const router = express.Router();
const { Game, Reservation, User } = require("../../db/models");
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { authenticated } = require('./security-utils');

router.post('/', asyncHandler(async (req, res, next) => {
    // const {
    //     ownerId,
    //     address,
    //     dateTime,
    //     minSkill,
    //     maxSkill,
    //     extraInfo,
    // } = req.body;
    // console.log(req.body)
    try {
        const game = await Game.create(req.body);
        // const game = await Game.create({
        //     ownerId,
        //     address,
        //     dateTime,
        //     minSkill,
        //     maxSkill,
        //     extraInfo
        // })

        res.status(201).send(game)
    } catch (e) {
        res.status(400).send(e)
    }
}));

// router.get('/:lat/:long/:radius', async (req, res) => {
router.get('', [authenticated], async (req, res) => {
    const user = req.user;
    const games = await Game.findAll({});
    let travelTime;
    games.forEach(game => {
        // here goes fetch call to determine distance/travel-time between user and game
        game.travelTime = travelTime;
        // const reservations = Reservation.findAll({where: {gameId: game.id}});
        // game.count = reservations.length;
    })
    res.json({games});
});

router.get('/:id', async(req, res) => {
    const id = Number(req.params.id);
    const game = await Game.findByPk(id);
    let owner = await User.findByPk(game.ownerId);
    const reservations = await Reservation.findAll({where: {gameId: game.id}});
    let players = [];
    reservations.forEach(async(reservation) => {
        let player = await User.findByPk(reservation.playerId);
        players.push(player);
    });
    res.json({...game, owner, players});
})

// Do we want to allow a game owner to transfer ownership to another user?
router.put('/:id', async (req, res) => {
    const userId = req.body.id;
    // const game = await Game.findOne({ id: req.params.id })
    const game = await Game.findByPk(Number(req.params.id));

    if (game.ownerId !== userId) {
        res.status(401).send("Unauthorized Access");
    }
    game = {...game, ...req.body};

    // game.address = req.body.address;
    // game.dateTime = req.body.dateTime;
    // game.minSkill = req.body.minSkill;
    // game.maxSkill = req.body.maxSkill;
    // game.extraInfo = req.body.extraInfo;

    await game.save();
    res.status(200).json(game);

});

router.delete("", [authenticated], asyncHandler(async(req, res) => {
    const user = req.user;
    const game = await Game.findByPk(Number(req.params.id))   ;
    if (game.ownerId !== user.id) res.status(401).send("Unauthorized Access");
    try{
      await game.destroy();
      res.json({});
    } catch(e) {
      res.status(400).send(e);
    }
}));

module.exports = router;

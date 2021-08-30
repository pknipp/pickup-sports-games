const express = require('express');
const asyncHandler = require('express-async-handler');
const faker = require('faker');
const { Op } = require('sequelize');
const fetch = require('node-fetch');

const { Game, Reservation, User, GameType, Skill } = require("../../db/models");
const { authenticated } = require('./security-utils');
const { mapsConfig: { mapsApiKey } } = require('../../config');
const checkLocation = require('./checkLocation');
const gameType = require('../../db/models/gameType');

const router = express.Router();
// const bools = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    let [game, message, status] = [{}, '', 201];
    // try {
        req.body.ownerId = req.user.id;
        req.body.dateTime = faker.date.future();
        let checked = await checkLocation(req.body.Location);
        if (checked.success) {
          req.body.Location = checked.Location;
          // game = await Game.create(req.body);
          game = (await Game.create(req.body)).dataValues;
          game = {...game, count: 0, reservationId: 0};
        } else {
          game.message = `There is something wrong with your game's location (${req.body.Location}).`
          status = 400;
        }
        // console.log("game = ", game)
        // res.status(status).json({game});
        res.status(201).json({id: game.id, message});
    // } catch (e) {
    //     res.status(400).send(e)
    // }
}));

router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    const user = req.user;
    // transform Query return to an array of pojos, to enable us to attach properties to each
    const games = (await Game.findAll({})).map(game => game.dataValues);
    const allVenues = [];
    games.forEach(async game => {
        allVenues.push(game.Location);
        game["Game organizer"] = (await User.findByPk(game.ownerId)).dataValues.Nickname;
        game.Sport = (await GameType.findByPk(game.gameTypeId)).dataValues.Sport;
        // delete game.owner.hashedPassword;
        let reservations = await Reservation.findAll({where: {gameId: game.id}});
        // transform Query to an array of pojos, to enable us to compute array's length
        game["Player reservations"] = reservations.length;
        // Set reservationId to zero if no reservation for this game has been made by this user.
        game.reservationId = reservations.reduce((reservationId, reservation) => {
            return (reservation.playerId === user.id ? reservation.id : reservationId);
        }, 0);
        ['gameTypeId', 'ownerId', 'createdAt', 'updatedAt'].forEach(key => delete game[key]);
    })
    // fetch travel-Time between user and a bundled array of addresses ("venues")
    // google restricts each bundle to contain no more than 25 addresses
    const maxFetch = 25;
    let nBundle = 0;
    while (allVenues.length) {
      let venues = allVenues.splice(0, Math.min(maxFetch, allVenues.length));
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${user.Address}&destinations=${venues.join('|')}&key=${mapsApiKey}`);
      let data = await response.json();
      data.rows[0].elements.forEach((element, index) => {
        games[index + nBundle * maxFetch].duration = element.duration;
      });
      nBundle++;
    }
    res.json({games});
}));

router.get('/:id', [authenticated], asyncHandler(async(req, res, next) => {
  const user = req.user;
  const gameId = Number(req.params.id);
  const game = (await Game.findByPk(gameId)).dataValues;
  let gameTypeId = game.gameTypeId;
  game.Sports = (await GameType.findAll()).map(gameType => ({id: gameType.id, Sport: gameType.Sport, skills: JSON.parse(gameType.skills)}));
  const gameType = await GameType.findByPk(gameTypeId);
  game.positions = gameType.positions && JSON.parse(gameType.positions);
  game.sizes     = gameType.sizes     && JSON.parse(gameType.sizes);
  if (game.ownerId !== user.id) return next({ status: 401, message: "You are not authorized." });
  const reservations = await Reservation.findAll({where: {gameId}});
  let players = [];
  for await (reservation of reservations) {
    let player = (await User.findByPk(reservation.playerId)).dataValues;
    player.Skill = (await Skill.findOne({where: {gameTypeId, userId: player.id}})).skill;
    reservation = reservation.dataValues;
    ['gameId', 'id', 'playerId', 'createdAt'].forEach(prop => delete reservation[prop]);
    ['First name', 'Last name', 'Address', 'tokenId', 'hashedPassword', 'updatedAt'].forEach(prop => delete player[prop]);
    player = {...player, ...reservation};
    console.log("player = ", player);
    players.push(player);
  };
  res.json({game: {...game, owner: user, players}});
}))

// Do we want to allow a game owner to transfer game-"owner"ship to another user?
router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
    const gameId = Number(req.params.id);
    let game = await Game.findByPk(gameId);
    let message = '';
    if (game.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    // confirm that Google Maps API can find a route between game's address & NYC
    let checked = await checkLocation(req.body.Location);
    if (checked.success) {
      req.body.Location = checked.Location;
    } else {
      message = `There is something wrong with your game's location (${req.body.Location}).`
      delete req.body.Location;
    }
    if (req.body.gameTypeId !== game.gameTypeId) {
      (await Reservation.findAll({where: {gameId}})).forEach(async reservation => {
        reservation.bools = 0;
        await reservation.save();
      });
    }
    Object.entries(req.body).forEach(([key, value]) => {
        game[key] = value !== '' ? value : null;
    });
    // Set max/min restrictions on skill to "unspecified" if #gameTypeId is changed
    // The following is now handled on the front, in EditGame component.
    // ["Minimum skill", "Maximum skill"].forEach(key => game[key] *= Number(sameGameType));
    await game.save();
    // game = {...game.dataValues, message};
    res.status(200).json({id: game.id, message});
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
    const game = await Game.findByPk(Number(req.params.id));
    if (game.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    // try{
      await game.destroy();
      res.json({});
    // } catch(e) {
    //   res.status(400).send(e);
    // }
}));

module.exports = router;

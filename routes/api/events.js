const express = require('express');
const asyncHandler = require('express-async-handler');
const faker = require('faker');
const { Op } = require('sequelize');
const fetch = require('node-fetch');

const { Event, Reservation, User, Sport, Skill } = require("../../db/models");
const { authenticated } = require('./security-utils');
const { mapsConfig: { mapsApiKey } } = require('../../config');
const checkLocation = require('./checkLocation');

const router = express.Router();

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    let [event, message, status] = [{}, '', 201];
    // try {
        req.body.ownerId = req.user.id;
        req.body.dateTime = faker.date.future();
        let checked = await checkLocation(req.body.Location);
        if (checked.success) {
          req.body.Location = checked.Location;
          event = (await Evebt.create(req.body)).dataValues;
          event = {...event, count: 0, reservationId: 0};
        } else {
          event.message = `There is something wrong with your event's location (${req.body.Location}).`
          status = 400;
        }
        res.status(201).json({id: event.id, message});
}));

router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    const user = req.user;
    // transform Query return to an array of pojos, to enable us to attach properties to each
    const events = (await Event.findAll({})).map(event => event.dataValues);
    const allVenues = [];
    events.forEach(async event => {
        allVenues.push(event.Location);
        event["Event organizer"] = (await User.findByPk(event.ownerId)).dataValues.Nickname;
        event.Sport = (await Sport.findByPk(event.sportId)).dataValues.Name;
        let reservations = await Reservation.findAll({where: {eventId: event.id}});
        // transform Query to an array of pojos, to enable us to compute array's length
        event["Player reservations"] = reservations.length;
        // Set reservationId to zero if no reservation for this event has been made by this user.
        event.reservationId = reservations.reduce((reservationId, reservation) => {
            return (reservation.playerId === user.id ? reservation.id : reservationId);
        }, 0);
        ['sportId', 'ownerId', 'createdAt', 'updatedAt'].forEach(key => delete event[key]);
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
        events[index + nBundle * maxFetch].duration = element.duration;
      });
      nBundle++;
    }
    res.json({events});
}));

router.get('/:id', [authenticated], asyncHandler(async(req, res, next) => {
  const user = req.user;
  const eventId = Number(req.params.id);
  const event = (await Event.findByPk(eventId)).dataValues;
  let sportId = event.sportId;
  event.Sports = (await Sport.findAll()).map(sport => ({id: sport.id, Sport: sport.Name, skills: JSON.parse(sport.skills)}));
  const sport = await Sport.findByPk(sportId);
  event.positions = sport.positions && JSON.parse(sport.positions);
  event.sizes     = sport.sizes     && JSON.parse(sport.sizes);
  if (event.ownerId !== user.id) return next({ status: 401, message: "You are not authorized." });
  const reservations = await Reservation.findAll({where: {eventId}});
  let players = [];
  for await (reservation of reservations) {
    let player = (await User.findByPk(reservation.playerId)).dataValues;
    player.Skill = (await Skill.findOne({where: {sportId, userId: player.id}})).skill;
    reservation = reservation.dataValues;
    ['eventId', 'id', 'playerId', 'createdAt'].forEach(prop => delete reservation[prop]);
    ['First name', 'Last name', 'Address', 'tokenId', 'hashedPassword', 'updatedAt'].forEach(prop => delete player[prop]);
    player = {...player, ...reservation};
    // console.log("player = ", player);
    players.push(player);
  };
  res.json({event: {...event, owner: user, players}});
}))

// Do we want to allow an event owner to transfer event-"owner"ship to another user?
router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
    const eventId = Number(req.params.id);
    let event = await Event.findByPk(eventId);
    let message = '';
    if (event.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    // confirm that Google Maps API can find a route between event's address & NYC
    let checked = await checkLocation(req.body.Location);
    if (checked.success) {
      req.body.Location = checked.Location;
    } else {
      message = `There is something wrong with your event's location (${req.body.Location}).`
      delete req.body.Location;
    }
    if (req.body.sportId !== event.sportId) {
      (await Reservation.findAll({where: {eventId}})).forEach(async reservation => {
        reservation.bools = 0;
        await reservation.save();
      });
    }
    Object.entries(req.body).forEach(([key, value]) => {
        event[key] = value !== '' ? value : null;
    });
    // Set max/min restrictions on skill to "unspecified" if #sportId is changed
    // The following is now handled on the front, in EditEvent component.
    // ["Minimum skill", "Maximum skill"].forEach(key => event[key] *= Number(sameSport));
    await event.save();
    res.status(200).json({id: event.id, message});
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
    const event = await Event.findByPk(Number(req.params.id));
    if (event.ownerId !== req.user.id) res.status(401).send("Unauthorized Access");
    // try{
      await event.destroy();
      res.json({});
    // } catch(e) {
    //   res.status(400).send(e);
    // }
}));

module.exports = router;

const express = require('express');
const router = express.Router();
const { Event, Reservation, User, Sport } = require("../../db/models");
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { authenticated } = require('./security-utils');

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    req.body.userId = req.user.id;
    req.body.boolVals = JSON.stringify(req.body.boolVals);
    let reservation = await Reservation.create(req.body);
    let event = (await Event.findByPk(reservation.eventId)).dataValues;
    event.Sport = (await Sport.findByPk(event.sportId)).Name;
    reservation = {...reservation.dataValues, event};

    res.status(201).send({reservation})
    // } catch (e) {
        // res.status(400).send(e)
    // }
}));

router.get('', [authenticated], asyncHandler(async(req, res) => {
    const user = req.user;
    const reservations = await Reservation.findAll({});
    res.json({reservations});
}));

router.get('/:resEventId', async(req, res) => {
    const [reservationId, eventId] = req.params.resEventId.split('-').map(id => Number(id));
    let reservation = (reservationId && (await Reservation.findByPk(reservationId)).dataValues) || {};
    reservation.boolVals = reservation.boolVals && JSON.parse(reservation.boolVals);
    const event = (await Event.findByPk(eventId)).dataValues;
    const sport = await Sport.findByPk(event.sportId);
    event.Sport = sport.Name;
    event.boolTypes = JSON.parse(sport.boolTypes);
    reservation.event = event;
    res.json({reservation});
})

router.put('/:id', [authenticated], asyncHandler(async(req, res) => {
    let reservation = await Reservation.findByPk(Number(req.params.id));
    if (reservation.userId !== req.user.id) res.status(401).send("Unauthorized Access");
    req.body.boolVals = JSON.stringify(req.body.boolVals);
    Object.keys(req.body).forEach(key => reservation[key] = req.body[key]);
    await reservation.save();
    let event = (await Event.findByPk(reservation.eventId)).dataValues;
    event.Sport = (await Sport.findByPk(event.sportId)).Name;
    reservation = reservation.dataValues;
    reservation.boolVals = JSON.parse(reservation.boolVals);
    reservation.event = event;
    res.status(200).json({reservation});
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
    const reservation = await Reservation.findByPk(Number(req.params.id));
    if (reservation.userId !== req.user.id) res.status(401).send("Unauthorized Access");
    try{
      await reservation.destroy();
      res.json({});
    } catch(e) {
      res.status(400).send(e);
    }
}));

module.exports = router;

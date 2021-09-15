const express = require('express');
const asyncHandler = require('express-async-handler');

const { Favorite, Sport } = require('../../db/models');
const { authenticated } = require('./security-utils');

const router = express.Router();

router.post('', [authenticated], asyncHandler(async (req, res, next) => {
    // try {
    // Minimize Skill at moment when Favorite is first created.
    req.body = {...req.body, userId: req.user.id, Skill: 0};
    let favorite = await Favorite.create(req.body);
    res.status(201).send({favorite: favorite.dataValues})
    // } catch (e) {res.status(400).send(e)}
}));

// used in useEffects of User component & of EditEvent
router.get('', [authenticated], asyncHandler(async(req, res, next) => {
    // try {
    let userId = req.user.id;
    let favorites = (await Favorite.findAll({where: {userId}})).map(favorite => favorite.dataValues);
    for (let i = 0; i < favorites.length; i++) {
    // Whey cannot I use the following array method for this loop?
        // favorites = favorites.map(async favorite => {
        let favorite = favorites[i];
        let sport = (await Sport.findByPk(favorite.sportId)).dataValues;
        favorite.Skills = JSON.parse(sport.Skills);
        favorite.Name = sport.Name;
    };
    favorites.sort((a, b) => a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0);
    res.json({favorites});
    // } catch(e) {console.log(e)}
}));

router.put('/:id', [authenticated], asyncHandler(async (req, res, next) => {
    // try {
    let favorite = await Favorite.findByPk(req.params.id);
    if (favorite.userId !== req.user.id) res.status(401).send("Unauthorized Access");
    favorite.Skill = req.body.Skill;
    await favorite.save();
    res.status(201).send({favorite: favorite.dataValues})
    // } catch (e) {res.status(400).send(e)}
}));

router.delete("/:id", [authenticated], asyncHandler(async(req, res) => {
    // try{
    const favorite = await Favorite.findByPk(Number(req.params.id));
    if (favorite.userId !== req.user.id) res.status(401).send("Unauthorized Access");
    await favorite.destroy();
    res.json({});
    // } catch(e) {res.status(400).send(e)}
}));

module.exports = router;

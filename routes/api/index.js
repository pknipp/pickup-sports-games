const router = require('express').Router();
const routes = ['session', 'users', 'games', 'reservations', 'photo'];
routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));
module.exports = router;

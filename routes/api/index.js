const router = require('express').Router();
const routes = ['session', 'users', 'games'];
routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));
module.exports = router;

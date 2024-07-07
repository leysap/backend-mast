const express = require('express');

const router = express.Router();


// const { checkToken } = require('./middlewares');

const apiUsuariosRouter = require('./api/usuarios');
const apiRestaurantesRouter = require('./api/restaurantes');

router.use('/usuarios', apiUsuariosRouter);
router.use('/restaurantes', apiRestaurantesRouter);

module.exports = router;
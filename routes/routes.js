const express = require('express');
const { userController } = require('../controllers/userController');
const config  = require('../config');
const router = express.Router();

router.get(`/${config.get('version')}/user/:id/address`, userController.getAddressByUserId);

module.exports = { router };

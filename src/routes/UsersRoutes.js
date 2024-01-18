const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/UsersControllers');
const UsersHelpers = require('../helpers/UsersHelpers')
const ValidationHelpers = require('../helpers/ValidationHelpers');



router.post('/register', ValidationHelpers.validateDataUser,UsersHelpers.checkUserData, UsersControllers.createUser);
router.post('/login', ValidationHelpers.validateLogin, UsersControllers.loginUser);

module.exports = router;
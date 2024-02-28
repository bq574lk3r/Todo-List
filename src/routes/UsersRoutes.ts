import express from 'express';
import usersControllers from '../controllers/UsersControllers';
import usersHelpers from '../helpers/UsersHelpers';
import validationHelpers from '../helpers/ValidationHelpers';
const router = express.Router();

router.post('/register', validationHelpers.validateDataUser, usersHelpers.checkUserData, usersControllers.createUser);
router.post('/login', validationHelpers.validateLogin, usersControllers.loginUser);

export default router;
import express from 'express';
import usersControllers from '../controllers/UsersControllers';
import validationHelpers from '../helpers/ValidationHelpers';
const router = express.Router();

router.post('/register', validationHelpers.validateDataUser, usersControllers.createUser);
router.post('/login', validationHelpers.validateLogin, usersControllers.loginUser);

export default router;
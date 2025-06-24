const {Router} = require('express');
const usersRouter = Router();
const usersController = require('../controllers/usersController');

usersRouter.get('/',usersController.usersListGet);
usersRouter.get('/create',usersController.usersCreateGet);
usersRouter.post('/create',usersController.usersCreatePost);

module.exports = usersRouter;
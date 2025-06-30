const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkAuth = require('../middleware/auth');
router.post('/signup', userController.createUser);
router.post('/login', userController.userLogin);
router.post('/favourites/:eventId', checkAuth, userController.addFavourite);
router.get('/favourites/:userId', checkAuth, userController.getFavourites);
router.delete('/favourites/:eventId', checkAuth, userController.removeFavourite);
router.get('/role/:userId', checkAuth, userController.getUserRole)
router.post('/request/:userId', userController.makeRequest);
router.get('/requests', userController.getRequests);

module.exports = router;

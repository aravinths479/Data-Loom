const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth ,indexController.home);


module.exports = router;

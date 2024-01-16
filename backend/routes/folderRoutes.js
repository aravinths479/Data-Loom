const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const requireAuth =  require("../middleware/requireAuth")

// Create a new folder
router.post('/',requireAuth, folderController.createFolder);

// Get folders for a specific user
router.get('/:userId', requireAuth, folderController.getFoldersByUser);

// Get subfolders for a specific folder
router.get('/subfolders/:folderId',requireAuth, folderController.getSubfoldersByFolder);


module.exports = router;



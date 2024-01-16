const express = require('express');
const router = express.Router();
const multer = require('multer');


const filesController = require("../controllers/fileController")
const requireAuth =  require("../middleware/requireAuth")


const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');


// Configure AWS
const s3 = new S3Client({
    region: 'ap-south-1',
  credentials: {
    accessKeyId: 'AKIASGQARUQKOR4HBPUI',
  secretAccessKey: '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',
 
  },
});

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage as we'll directly upload the buffer to S3
});

// Define a route for file upload
router.post('/upload',requireAuth, upload.single('file'),filesController.uploadFile);

router.get('/getFiles',requireAuth,filesController.getFiles)

router.delete('/deleteFile/:fileId/:fileName/:fileType',requireAuth,filesController.deleteFile)

router.get('/getUserStorage',requireAuth,filesController.calculateUsedStorage)

router.post("/share-file",requireAuth,filesController.shareFile)

router.get("/shared-with-me",requireAuth,filesController.sharedWithMe)

router.get("/get-recycle-Bin",requireAuth,filesController.getAllRecycledFiles)

router.delete("/empty-recycle-bin",requireAuth,filesController.emptyRecycleBin)

router.post("/restore-from-recycle-bin",requireAuth,filesController.restoreFromRecycleBin)

router.get("/search",requireAuth,filesController.searchFiles)


module.exports = router;




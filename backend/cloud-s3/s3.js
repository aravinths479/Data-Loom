

const express = require('express');
const cors = require("cors")
const app = express();
app.use(cors());
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');




// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage as we'll directly upload the buffer to S3
});

// Define a route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  const fileName = Date.now() + '_' + req.file.originalname;

  const params = {
    Bucket: 'aravinth-s3',
    Key: fileName,
    Body: req.file.buffer,
    ACL: 'public-read', // or 'private' if you want to restrict access
    ContentType: req.file.mimetype,
    ContentDisposition: 'inline',
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("Uploaded");
    res.json({ message: 'File uploaded successfully', key: fileName });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

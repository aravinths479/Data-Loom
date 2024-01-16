const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const rateLimit = require('express-rate-limit');
const app = express();

require('dotenv').config(); // Load environment variables


app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


app.use(cors())

// const limiter = rateLimit({
//   windowMs: 1000, // 1 minute
//   max: 10, // limit each IP to 10 requests per windowMs
//   message: 'Too many requests from this IP, please try again after a minute.',
// });

// app.use(limiter);



// Routes
const userRoutes = require('./routes/userRoutes');
const indexRoutes = require('./routes/indexRoutes')
const folderRoutes = require("./routes/folderRoutes")
const filesRoutes = require("./routes/filesRoutes")


app.use('/api/index',indexRoutes);
app.use('/api/users', userRoutes);
app.use('/api/folder',folderRoutes);
app.use('/api/files',filesRoutes)




app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});


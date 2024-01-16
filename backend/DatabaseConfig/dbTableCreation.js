const db = require("./db")
const mysql = require("mysql2");
const util = require("util");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});



// SQL queries for table creation
const createTablesQueries = [
  `
  CREATE TABLE IF NOT EXISTS users (
    userId varchar(36) PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS files (
    fileId varchar(36) PRIMARY KEY,
    userId varchar(36),
    folderId varchar(36),
    fileType varchar(8),
    fileSize varchar(10),
    fileName VARCHAR(255) NOT NULL,
    fileUrl VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS recycle_bin (
    recycleId varchar(36) PRIMARY KEY,
    fileId varchar(36),
    userId varchar(36),
    fileType varchar(8),
    fileSize varchar(10),
    fileName VARCHAR(255) NOT NULL,
    fileUrl VARCHAR(255) NOT NULL,
    deleteTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS file_shares (
    fileId varchar(36),
    sharedToUserEmail VARCHAR(255) REFERENCES users(email),
    sharedByUserEmail VARCHAR(255) REFERENCES users(email),
    shareTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fileId, sharedToUserEmail),
    FOREIGN KEY (fileId) REFERENCES files(fileId),
    FOREIGN KEY (sharedToUserEmail) REFERENCES users(email),
    FOREIGN KEY (sharedByUserEmail) REFERENCES users(email)
  )
  `,
];

// Function to execute the SQL queries
async function createTables() {
  try {
    for (const queryText of createTablesQueries) {
      db.query(queryText,(err,res)=>{
        if(err){
          console.log(err);
        }
        else if(res){
          console.log(res);
        }
      })
    }
  } catch (error) {
    console.error("Error creating tables:", error.message);
  } finally {
    pool.end(); // Close the connection pool
  }
}

// Call the function to create tables
createTables();

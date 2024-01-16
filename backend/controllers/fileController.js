const db = require("../DatabaseConfig/db");
const multer = require("multer");
const uuid = require("uuid");
const { query } = require("express");
const userStorage = require("../utils/userStorage");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");


exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    const fileName = req.file.originalname;
    const fileType = fileName.split(".").pop(); // Get file extension as file type
    const size = req.file.size;
    const fileId = uuid.v4(); // Generate UUID for fileId
    const fileUrl = `https://aravinth-s3.s3.ap-south-1.amazonaws.com/${fileId}_${fileName}`;

    const fileSize = (size / 1024 / 1024).toFixed(2) + "";

    // Upload to S3
    const params = {
      Bucket: "aravinth-s3",
      Key: fileId + "_" + fileName,
      Body: req.file.buffer,
      ACL: "public-read",
      ContentType: req.file.mimetype,
      ContentDisposition: "inline",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Insert into the database
    const insertQuery =
      "INSERT INTO files (fileId, userId, folderId, fileType, fileSize, fileName, fileUrl) VALUES (?, ?, ?, ?, ?, ?, ?)";

    const values = [
      fileId,
      req.user.userId,
      null,
      fileType,
      fileSize,
      fileName,
      fileUrl,
    ];

    db.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error("Error inserting into database:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log(fileId + fileName + fileType + fileUrl);
      res.json({
        fileId,
        userId: req.user.userId,
        fileName,
        fileSize,
        fileType,
        fileUrl,
        folderId: null,
      });
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = "SELECT * FROM files WHERE userId = ?";
    db.query(query, [userId], (error, result) => {
      if (error) {
        console.error(
          "Error retrieving file information from the database:",
          error
        );
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log(result);
        return res.json(result);
      }
    });
  } catch (error) {
    console.error(
      "Error retrieving file information from the database:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllRecycledFiles = (req, res) => {
  const userId = req.user.userId;
  db.query(
    `SELECT * FROM recycle_bin where userId = "${userId}"`,
    (error, results) => {
      if (error) {
        console.error("Error fetching recycled files:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // If there are no errors, return the list of recycled files
      return res.json(results);
    }
  );
};

// Configure AWS
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIASGQARUQKOR4HBPUI",
    secretAccessKey: "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",
  },
});



exports.calculateUsedStorage = async (req, res) => {
  try {
    // Query to sum up file sizes in megabytes
    const userId = req.user.userId;
    db.query(
      "SELECT fileSize FROM files WHERE userId = ?",
      [userId],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.json({ message: error });
        } else {
          const totalSize = result.reduce((acc, file) => {
            const fileSize = parseFloat(file.fileSize);
            if (!isNaN(fileSize)) {
              return acc + fileSize;
            } else {
              return acc;
            }
          }, 0);
          const totalStorage = 500.0;

          // Calculate used storage and percentage
          const usedStorageMB = totalSize;
          const percentageUsed = (usedStorageMB / totalStorage) * 100;
          res.json({ usedStorageMB, percentageUsed, totalStorage });
        }
      }
    );
  } catch (error) {
    console.error("Error calculating used storage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.shareFile = async (req, res) => {
  const { sharedToUserEmail, fileId } = req.body;
  const sharedByUserEmail = req.user.email;
  const insert_query =
    "INSERT INTO file_shares (fileId,sharedToUserEmail,sharedByUserEmail) VALUES (?,?,?)";
  const values = [fileId, sharedToUserEmail, sharedByUserEmail];

  db.query(insert_query, values, (error, result) => {
    if (error) {
      console.log(error);

      // Check for duplicate entry error
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          error: "Duplicate entry. The file is already shared with this user.",
        });
      }
      return res.status(500).json({
        error: "Internal server Error. Try again Later",
      });
    } else {
      return res
        .status(201)
        .json({ message: `File shared successfully to ${sharedToUserEmail}` });
    }
  });
};

exports.sharedWithMe = async (req, res) => {
  const userEmail = req.user.email;

  // Query to retrieve files shared with the user
  const query =
    "SELECT fs.fileId, fs.sharedByUserEmail, fs.shareTimestamp, f.fileName, f.fileType, f.fileSize, f.fileUrl FROM file_shares fs INNER JOIN files f ON fs.fileId = f.fileId WHERE fs.sharedToUserEmail = ?";

  db.query(query, [userEmail], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const sharedFiles = results.map((row) => ({
      fileId: row.fileId,
      sharedByUserEmail: row.sharedByUserEmail,
      shareTimestamp: row.shareTimestamp,
      fileName: row.fileName,
      fileType: row.fileType,
      fileSize: row.fileSize,
      fileUrl: row.fileUrl,
    }));
    console.log(sharedFiles);
    return res.status(200).json(sharedFiles);
  });
};

exports.deleteFile = (req, res) => {
  const fileIdToDelete = req.params.fileId;
  const userId = req.user.userId;

  console.log("Deleting file with ID:", fileIdToDelete);

  db.query(
    `select * from files where fileId = "${fileIdToDelete}"`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err });
      } else {
        if (result.length == 0) {
          return res.json({ message: "file with the id don't exists" });
        }
        db.query(
          "insert into recycle_bin (recycleId, fileId, userId, fileType, fileSize, fileName, fileUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            uuid.v4(),
            fileIdToDelete,
            userId,
            result[0].fileType,
            result[0].fileSize,
            result[0].fileName,
            result[0].fileUrl,
          ],
          (insertError, insertResult) => {
            if (insertError) {
              console.log(insertError);
            } else {
              console.log(insertResult);
              db.query(
                `delete from file_shares where fileId = "${fileIdToDelete}"`,
                (sharedFileDeleteError, sharedFileDeleteSuccess) => {
                  if (sharedFileDeleteError) {
                    console.log(sharedFileDeleteError);
                  } else {
                    console.log(sharedFileDeleteSuccess);
                    db.query(
                      `delete from files where fileId = "${fileIdToDelete}" and userId = "${userId}"`,
                      (fileDeleteError, fileDeleteSuccess) => {
                        if (fileDeleteError) {
                          console.log(fileDeleteError);
                        } else {
                          console.log(fileDeleteSuccess);
                          return res
                            .status(200)
                            .json({ message: "File moved to Recycle Bin" });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

exports.emptyRecycleBin = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Retrieve files from the recycle bin
    const recycleBinFilesQuery = "SELECT * FROM recycle_bin WHERE userId = ?";
    db.query(recycleBinFilesQuery, [userId], async (error, recycleBinFiles) => {
      if (error) {
        console.error("Error retrieving files from the recycle bin:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Iterate through each file in the recycle bin
      for (const file of recycleBinFiles) {
        try {
          // Construct S3 parameters
          const s3Params = {
            Bucket: "aravinth-s3",
            Key: file.fileId + "_" + file.fileName,
          };

          // Delete the file from S3
          const deleteCommand = new DeleteObjectCommand(s3Params);
          await s3.send(deleteCommand);
          console.log(`File deleted from S3: ${file.fileName}`);
        } catch (s3Error) {
          console.error("Error deleting file from S3:", s3Error);
        }
      }

      // Empty the recycle bin in the database
      const emptyRecycleBinQuery = "DELETE FROM recycle_bin WHERE userId = ?";
      db.query(
        emptyRecycleBinQuery,
        [userId],
        (emptyRecycleBinError, result) => {
          if (emptyRecycleBinError) {
            console.error("Error emptying recycle bin:", emptyRecycleBinError);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          console.log("Recycle bin emptied successfully");
          return res.json({ success: true });
        }
      );
    });
  } catch (dbError) {
    console.error("Error accessing the database:", dbError);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.restoreFromRecycleBin = (req, res) => {
  console.log("hai");
  const { recycleId } = req.body;
  const userId = req.user.userId;

  // Check if the file exists in the recycle bin
  const checkRecycleBinQuery =
    "SELECT * FROM recycle_bin WHERE recycleId = ? AND userId = ?";
  db.query(checkRecycleBinQuery, [recycleId, userId], (error, results) => {
    if (error) {
      console.error("Error checking recycle bin:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "File not found in the recycle bin" });
    }

    const fileInRecycleBin = results[0];
    console.log(fileInRecycleBin);

    // Move the file back to the files table
    const restoreFileQuery = `
      INSERT INTO files (fileId, userId, folderId, fileType, fileSize, fileName, fileUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      restoreFileQuery,
      [
        fileInRecycleBin.fileId,
        fileInRecycleBin.userId,
        fileInRecycleBin.folderId,
        fileInRecycleBin.fileType,
        fileInRecycleBin.fileSize,
        fileInRecycleBin.fileName,
        fileInRecycleBin.fileUrl,
      ],
      (restoreError, deleteResponse) => {
        if (restoreError) {
          console.error("Error restoring file to files table:", restoreError);
          return res.status(500).json({ error: "Internal Server Error" });
        } else if (deleteResponse) {
          console.log("deleted Sucessfully");
          console.log(deleteResponse);
        }

        // Delete the file from the recycle bin
        const deleteFromRecycleBinQuery =
          "DELETE FROM recycle_bin WHERE recycleId = ?";
        db.query(deleteFromRecycleBinQuery, [recycleId], (deleteError) => {
          if (deleteError) {
            console.error("Error deleting file from recycle bin:", deleteError);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Send a success response
          res.status(200).json({ message: "File restored successfully" });
        });
      }
    );
  });
};

exports.searchFiles = (req, res) => {
  const userId = req.user.userId;
  const { query } = req.query;
  console.log(query);

  // Query to search for files based on the provided query
  const searchQuery =
    "SELECT * FROM files WHERE userId = ? AND (fileName LIKE ? OR fileType LIKE ?)";

  db.query(searchQuery, [userId, `%${query}%`, `%${query}%`], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const searchResults = results.map((row) => ({
      fileId: row.fileId,
      userId: row.userId,
      folderId: row.folderId,
      fileType: row.fileType,
      fileSize: row.fileSize,
      fileName: row.fileName,
      fileUrl: row.fileUrl,
    }));
    return res.status(200).json(searchResults);
  });
};


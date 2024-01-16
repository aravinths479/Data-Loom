const db = require("../DatabaseConfig/db");

exports.calculateUsedStorage = (userID) => {
  try {
    // Query to sum up file sizes in megabytes
    db.query(
      "SELECT SUM(CAST(fileSize AS SIGNED)) AS totalSize FROM files where userId = ?",
      [userID],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.json({ message: error });
        } else {
          const totalStorageMB = 500;
          const usedStorageMB = result[0].totalSize || 0; // If no files, default to 0

          console.log(usedStorageMB);

          res.json({ usedStorageMB, totalStorageMB });
        }
      }
    );

  } catch (error) {
    console.error("Error calculating used storage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

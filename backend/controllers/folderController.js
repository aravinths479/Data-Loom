const db = require('../DatabaseConfig/db');
const uuid = require("uuid")



exports.createFolder = (req, res) => {
  const userId = req.user.userId;
  const { parentFolderId, folderName } = req.body;

  // Generate a new folderId using UUID
  const folderId = uuid.v1();

  // Insert a new folder into the database
  db.query(
    'INSERT INTO folders (folderId, userId, parentFolderId, folderName) VALUES (?, ?, ?, ?)',
    [folderId, userId, parentFolderId, folderName],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(201).json({ folderId, message: 'Folder created successfully.' });
      }
    }
  );
};





exports.getFoldersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all folders for a specific user
    const [folders] = await db.query('SELECT * FROM folders WHERE userId = ?', [userId]);

    res.status(200).json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSubfoldersByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    // Fetch subfolders for a specific folder
    const [subfolders] = await db.query('SELECT * FROM folders WHERE parentFolderId = ?', [folderId]);

    res.status(200).json(subfolders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getFoldersByUser = (req, res) => {
  
  const userId = req.user.userId; 

  // Fetch all folders for a specific user
  db.query('SELECT * FROM folders WHERE userId = ?', [userId], (error, folders) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(folders);
    }
  });
};

exports.getSubfoldersByFolder = (req, res) => {

  const userId = req.user.userId;
  const { folderId } = req.params;

  // Fetch subfolders for a specific folder and user
  db.query('SELECT * FROM folders WHERE parentFolderId = ? AND userId = ?', [folderId, userId], (error, subfolders) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(subfolders);
    }
  });
};


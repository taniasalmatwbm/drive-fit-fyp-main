const fs = require('fs');
const { google } = require('googleapis');
const mime = require('mime-types');
const path = require('path');

const KEYFILEPATH = path.join(__dirname, "../controllers/brand-uploader.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// 🔐 Your Google auth logic
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({
  version: 'v3',
  auth,
});

const FOLDER_ID = '10sZQC0qk8c8uofGfNb2TY22LxNUzvYPf'; // 📁 Target folder

const uploadFileToGoogleDrive = async (filePath, fileName) => {
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

//   const media = {
//     mimeType: mime.lookup(filePath) || 'image/jpeg',
//     body: fs.createReadStream(filePath),
//   };
const media = {
    mimeType: mime.lookup(filePath) || 'application/octet-stream',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    supportsAllDrives: true, // Important!
    fields: 'id, webViewLink',
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return response.data;
};

module.exports = { uploadFileToGoogleDrive };

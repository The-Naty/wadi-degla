const pdf = require('./export-pdf');
const api = require('./upload-to-google-drive');
const auth = require('./authorize');
const folder = require('./createFolder');
const fs = require('fs');


async function generateAndUpload(templateName, data, fileName, userID) {

  const folderID = await folder.createFolderIfNotExists(userID);

  async function upload() {

    const authClient = await auth.authorize();

    api.uploadFile(authClient, fileName, await folderID);

  }

  function deleteFile() {
    fs.unlink(`${fileName}.pdf`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Done');
      }
    });
  }

  pdf.generatePDF(templateName, data, fileName);

  setTimeout(upload, 20000);
  setTimeout(deleteFile, 21000);

}

module.exports = { generateAndUpload };



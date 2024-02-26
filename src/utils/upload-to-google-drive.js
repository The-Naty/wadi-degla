const fs = require('fs');
const { google } = require('googleapis');

async function uploadFile(authClient, fileName, folderID) {

    return new Promise((resolve, rejected) => {
        const drive = google.drive({ version: 'v3', auth: authClient });
        var fileMetaData = {
            name: `${fileName}.pdf`,
            parents: [`${folderID}`]
        }

        drive.files.create({
            resource: fileMetaData,
            media: {
                body: fs.createReadStream(`${fileName}.pdf`),
                mimeType: 'application/pdf'
            },
            fields: 'id'
        }, function (error, file) {
            if (error) {
                return rejected(error)
            }
            resolve(file);
        })
    });
}

module.exports = { uploadFile };

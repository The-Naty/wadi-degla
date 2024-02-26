const authorizeApi = require('./authorize');
const { google } = require('googleapis');


async function createFolderIfNotExists(folderName) {
    const drive = google.drive({ version: 'v3', auth: null });
    const auth = await authorizeApi.authorize();

    async function listFiles() {
        return new Promise((resolve, reject) => {
            drive.files.list(
                {
                    auth,
                    q: "'1djr2oqLQYOewjukYAuwHni-Rq62CrG1d' in parents and trashed=false",
                },
                (err, res) => {
                    if (err) return reject(err);
                    resolve(res.data);
                }
            );
        });
    }

    let folder;
  const files = await listFiles();
  files.files.forEach((file) => {
    if (file.name === folderName) {
      folder = file;
    }
  });

  if (folder) {
    return folder.id;
  } else {
    const fileMetadata = {
      name: folderName,
      parents: ['1djr2oqLQYOewjukYAuwHni-Rq62CrG1d'],
      mimeType: 'application/vnd.google-apps.folder',
    };

    const createdFolder = new Promise((resolve) => {
      drive.files.create(
        {
          auth,
          resource: fileMetadata,
          fields: 'id',
        },
        (err, result) => {
          if (err) {
            console.error(`Error creating folder: ${err}`);
          } else {
            resolve(result.data.id);
          }
        }
      );
    });

    return createdFolder;
  }
}

module.exports = { createFolderIfNotExists };
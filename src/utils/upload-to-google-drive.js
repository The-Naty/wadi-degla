const fs = require('fs');
const { google }= require('googleapis');

const apikeys = require('./api-key.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient, fileName){

    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 
        var fileMetaData = {
            name:`${fileName}.pdf`,    
            parents:['1djr2oqLQYOewjukYAuwHni-Rq62CrG1d']
        }

        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream(`${fileName}.pdf`), 
                mimeType:'application/pdf'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            resolve(file);
        })
    });
}

module.exports = {uploadFile,authorize};

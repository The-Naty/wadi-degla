const pdf = require('./export-pdf');
const api = require('./upload-to-google-drive');  
const fs = require('fs');


async function generate_upload(templateName,data,fileName){

    pdf.generatePDF(templateName,data,fileName);

    async function upload(){

        const authClient = await api.authorize();
        api.uploadFile(authClient,`${fileName}`);
    
    }

    function deleteFile(){
        fs.unlink(`${fileName}.pdf`, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('File is deleted.');
            }
          });
    }
    
    setTimeout(upload,20000);
    setTimeout(deleteFile,21000);

}

generate_upload('packing-list','','final-test');



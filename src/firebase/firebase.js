const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: "big-data-f1ace-firebase-adminsdk-cn3l4-f7496a983e.json"
});
let bucketName = "gs://big-data-f1ace.appspot.com/"

/** upload to firebase*/
 async function upToFirebase(code) {
    //send the package to firebase
    const filename = "../src/qr_code_file/" + code + ".png";
    await storage.bucket(bucketName).upload(filename, {
        gzip: true, metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
}

module.exports = {upToFirebase}
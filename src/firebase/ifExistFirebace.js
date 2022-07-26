const { Storage } = require('@google-cloud/storage');
const express = require("express");

const app = new express();
var fs = require('fs');


const storage = new Storage({
    keyFilename: "big-data-f1ace-firebase-adminsdk-cn3l4-f7496a983e.json",
});

let bucketName = "gs://big-data-f1ace.appspot.com/"

const downloadFile = async () => {
    let destFilename = './itay.png';
    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: destFilename,
    };
    var filename = 'itaytheking.png';
    // Downloads the file
    await storage.bucket(bucketName).file(filename).exists().then((exists) => {
        if (exists[0]) {
            console.log("File exists");
        } else {
            console.log("File does not exist");
        }
    });
    // console.log(
    //     `gs://${bucketName}/${filename} downloaded to ${destFilename}.`
    // );


}



downloadFile();
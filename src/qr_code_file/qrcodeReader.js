const QrCode = require('qrcode-reader');
const qr = new QrCode();

const fs = require('fs');


const Jimp = require("jimp");
const buffer = fs.readFileSync(__dirname + '/17971.png');
Jimp.read(buffer, function(err, image) {
    if (err) throw err+'1';
    const qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) throw err+'2';
        let jsonFile = JSON.parse(value.result);
        console.log(jsonFile.city);
        // console.log(value);
    };
    qr.decode(image.bitmap);
});
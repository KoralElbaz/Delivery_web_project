//https://www.geeksforgeeks.org/generate-a-qr-code-in-node-js/

// Require the package
const QRCode = require('qrcode')
 
// Creating the data
let data = {
    name:"test",
    type:"good"
}
 
// Converting the data into String format
let stringdata = JSON.stringify(data)
   
// Converting the data into base64
QRCode.toFile("./test.png",stringdata, function (err, code) {
    if(err) return console.log("error occurred")
 
})
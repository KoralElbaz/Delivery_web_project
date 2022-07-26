const QRCode = require('qrcode')
const {rpush} = require("./redis/setToRedis");
const {getOrder, getCode} = require("./help_function/getOrder");
const {upToFirebase} = require("./firebase/firebase");
const {setTime} = require("./help_function/setOrders");
const {sleep, deleteFile} = require("./help_function/myLibrary");


let timeForArrive = 1000;
let timePerOne = 3000;
let numArrive = 0;

const orders = {};
const Northern = 'Northern', Southern = 'Southern', Central = 'Central', TelAviv = 'Tel Aviv', Jerusalem = 'Jerusalem';
const toNorthern = 13, toSouthern = 10, toCentral = 7, toTelAviv = 5, toJerusalem = 8, toHaifa = 11;


/** create the QR code image */
function qrGenerator(path, data) {
    QRCode.toFile(path, data, function (err) {
        if (err) return console.log("error occurred")
    })
}


/** set when the order arrive */
function arrive(code, timeToWait) {
    setTimeout(async function () {

        // set the time of arriving
        let arriveTime = setTime();
        console.log((++numArrive)+')'+code + ' arrive at: ' + arriveTime);

        await upToFirebase(code);
        deleteFile('../src/qr_code_file/' + code + '.png');
        rpush('arrive',code);

        delete orders[code];
    }, timeToWait * timeForArrive)
}

//////////////////////////////
////////// start /////////////
//////////////////////////////
async function start(){
    let count = 5;
//for each order
    while (count > 0) {
        count--;

        //set code
        let randCode = getCode();
        orders[randCode] = getOrder(randCode);

        // set code to redis
        rpush('key', randCode);
        rpush('koral', randCode+'Prod');

        // Converting the data into String format
        let orderData = JSON.stringify(orders[randCode]);

        // Converting the data into base64
        qrGenerator("./qr_code_file/" + randCode + ".png", orderData);

        //send the package
        let toCity = {admin_name:orders[randCode]['admin_name']}
        if (toCity.admin_name === Northern) {
            arrive(randCode, toNorthern);
        } else if (toCity.admin_name === Southern) {
            arrive(randCode, toSouthern)
        } else if (toCity.admin_name === Central) {
            arrive(randCode, toCentral)
        } else if (toCity.admin_name === TelAviv) {
            arrive(randCode, toTelAviv)
        } else if (toCity.admin_name === Jerusalem) {
            arrive(randCode, toJerusalem)
        } else {
            arrive(randCode, toHaifa);
        }

        // delay
        await sleep(timePerOne)
        console.log(randCode+' Sent Successfully!');
    }
}

start()
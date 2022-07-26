const fs = require('fs');
const QrCode = require('qrcode-reader');
const {setTime} = require("./help_function/setOrders");
const {deleteFile, sleep, data1, prods, sizeForChart} = require("./help_function/myLibrary");
const Jimp = require("jimp");
const axios = require("axios");
const redis = require("redis");
const redisClient = redis.createClient();
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: "big-data-f1ace-firebase-adminsdk-cn3l4-f7496a983e.json"
});
let bucketName = "gs://big-data-f1ace.appspot.com/"
const Northern = 'Northern', Southern = 'Southern', Central = 'Central', TelAviv = 'Tel Aviv', Jerusalem = 'Jerusalem', Haifa = 'Haifa', orderSize = 'size of order';
// redisClient

/**-----------------*/
const http=require('http');
const app=require('./app');
const server=http.createServer(app);
const port=3000;

server.listen(port, () => {

    console.log(`Listening Socket on http://localhost:${port}`)
})

// const express = require('express')
// const app = express();
const socketIO = require('socket.io');


// app.use(express.static('public'))

// app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//     res.render("pages/dashboard", data1)
//   })


app.get('/setData/:districtId/:value', function (req, res) {
    io.emit('newdata',{districtId:req.params.districtId,value:req.params.value})
    io.emit('newdata2',prods)
    io.emit('newdata3',sizeForChart)
})


// const server = express()
//     .use(app)
//     .listen(port, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);

io.on('connection', (socket) => {
    socket.on('newdata', (msg) => {
        console.log(msg);
        io.emit('newdata', msg);
    });
    socket.on('newdata2', (msg) => {
        console.log(msg);
        io.emit('newdata2', msg);
    });
    socket.on('newdata3', (msg) => {
        console.log(msg);
        io.emit('newdata3', msg);
    });
});
/**-----------------*/


const orders = {};
const districts = {};
const queue = [];


districts[Northern] = 0;
districts[Southern] = 0;
districts[Central] = 0;
districts[TelAviv] = 0;
districts[Jerusalem] = 0;
districts[Haifa] = 0;

function socketCall(city,num){
    axios.get('http://localhost:3000/setdata/'+city+'/'+num)
        .catch(error => {console.log(error);});
}

function socketCall2(district,num, code){
    for (let i = 0; i < 3; i++) {
        prods[i] = prods[i+1]
    }
    let pri  = orders[code]['price']
    for (let i = 0; i < sizeForChart.length; i++) {
        if (district===sizeForChart[i].disId){
            ++sizeForChart[i].Total;
            if(pri<125){++sizeForChart[i].s}
            else if (pri<450){++sizeForChart[i].m}
            else {++sizeForChart[i].l}
        }
    }
    prods[3] = {districtId: 3, Id:code, District: district,AllPrice: pri, City:orders[code]['city']}
    axios.get('http://localhost:3000/setdata/'+district+'/'+num)
        .catch(error => {console.log(error);});
}


/** when the order arrive */
async function arrive(code) {
    let arrived = false;
    //     // set the time of arriving
    let arriveTime = setTime();
    orders[code]['Arrived at'] = arriveTime;
    console.log(code + ' Arrived at: ' + arriveTime);

    //send the package to firebase
    let destFilename = "./firebase/" + code + ".png";

    const options = {
        destination: destFilename,
    };
    const filename = code + '.png';
    // Downloads the file
    await storage.bucket(bucketName).file(filename).exists().then(async (exists) => {
        if (exists[0]) {
            arrived = true;
            await storage.bucket(bucketName).file(filename).download(options);
            console.log(
                `gs://${bucketName}/${filename} downloaded to ${destFilename}.`
            );
            await storage.bucket(bucketName).file(filename).delete();
        } else {
            console.log('File '+filename +' does not exist');
            queue.push(code);
        }
    });
    await sleep(2000);
    return arrived;
}

/** read the QR code and return json */
function readQrCode(code) {//src/firebase
    let flag = true;
    const buffer = fs.readFileSync(__dirname + '/firebase/' + code + '.png');
    let jsonFile;
    Jimp.read(buffer, function (err, image) {
        if (err) throw err;
        const qr = new QrCode();
        qr.callback = function (err, value) {
            if (err) {
                flag = false;
                readRedis(code);
            } else jsonFile = JSON.parse(value.result);
        };
        qr.decode(image.bitmap);
    });
    if (flag) setCodeInOrder(code, jsonFile);
    let city = orders[code]['admin_name'];
    districts[city]--;
    socketCall2(city, districts[city], code);
}

/** set the data of the json file in order */
function setCodeInOrder(code, codeJson) {
    try {
        orders[code]['city'] = codeJson.city;
        orders[code]['admin_name'] = codeJson.admin_name;
        orders[code]['send_at'] = codeJson.send_at;
        orders[code]['price'] = codeJson.price;
        orders[code]['VAT'] = codeJson.VAT;
        orders[code]['TAX'] = codeJson.TAX;
        orders[code]['size_of_order'] = codeJson.size_of_order;
    } catch (err) {
        readRedis(code);
    }
}

async function forHget(key, val) {
    redisClient.hget(key, val, function (err, rep) {
        if (err) throw err;
        if (rep === null) return;
        orders[key][val] = rep;
    })
    await sleep(1);
}

async function readRedis(code) {
    await forHget(code, 'city');
    await forHget(code, 'admin_name');
    await forHget(code, 'send_at');
    await forHget(code, 'price');
    await forHget(code, 'VAT');
    await forHget(code, 'TAX');
    await forHget(code, 'size_of_order');
}

async function start() {
    let i = 0;

    while (true) {
        // check package that sent
        redisClient.lrange('key', 0, -1, function (err, rep) {
            if (err) throw err;
            if (rep === null) return;
            for (let j = 0; j < rep.length; j++) {redisClient.lpop('key');}
            for (let j = 0; j < rep.length; j++) {
                let code = Number(rep[j]);
                orders[code] = {};
                redisClient.hget(code, 'admin_name', function (err, rep) {
                    if (err) throw err;
                    if (rep === null) return;
                    orders[code]['admin_name'] = rep;
                    districts[rep]++;
                    socketCall(rep,districts[rep])
                })
                redisClient.hget(code, 'city', function (err, rep) {orders[code]['city'] = rep;})
                redisClient.hget(code, 'price', function (err, rep) {orders[code]['price'] = Number(rep);})
                redisClient.rpush('codes', code);
                sleep(100);
            }
        })
        //check package that arrive
        redisClient.lrange('arrive', 0, -1, async function (err, rep) {
            if (err) throw err;
            if (rep === null) return;
            for (let j = 0; j < rep.length; j++) {redisClient.lpop('arrive');}
            for (let j = 0; j < rep.length; j++) {
                let code = Number(rep[j]);
                if (!orders[code]){orders[code] = {};}
                queue.push(code);
                console.log(code + ' is arrived!')
            }
        })
        let count = 0
        while (queue.length !== 0 && count < 3){
            count++
            let codeArrive = queue.shift()
            if (await arrive(codeArrive)) {
                console.log(i++)
                readQrCode(codeArrive);
                deleteFile('../src/firebase/' + codeArrive + '.png');
            } else console.log("******** not good ***********");
            await sleep(10)
        }
        //delay
        const delayInMilliseconds = 500;
        await sleep(delayInMilliseconds)
    }
}

start();

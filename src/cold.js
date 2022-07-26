const redis = require("redis");
const redisClient = redis.createClient();
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://koral:318477684@cluster0.ammj5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var fs = require('fs');
const csvjson = require('csvjson');
const {sleep} = require("./help_function/myLibrary");
const writeFile = fs.writeFile;

function insert(elem){
    const objResult = {products: []}
    objResult.products = Object.values(elem);

    // connect to MONGO db
    client.connect(err => {
        if (err) {
            console.log(err);
            return;
        }

    //  insert to MONGO db products from redis
        client.db("Analytics")
            .collection("products")
            .insertOne(objResult, (err, res) => {
                if (err) {
                    throw err;
                }
            })

    // read from mongoDB and export JSON
        client.db("Analytics")
            .collection("products")
            .find()
            .toArray(function (err, result) 
            {
                if (err) throw err;
                console.log(result);


                // Convert json to csv function
                const csvData = csvjson.toCSV(result, 
                    {
                    headers: 'Products',
                    wrap: true,
                    delimiter: ';'
                    });

                // Write data into csv file named college_data.csv
                writeFile('./output.csv', csvData, (err) => 
                {
                    if (err) 
                    {
                        // Do something to handle the error or just throw it
                        console.log(err);
                        throw new Error(err);
                    }
                    console.log('Data stored into csv file successfully');
                });
            })

    });
}

async function start()
{
    let i =0
    while (true)
    {
        // console.log(i++)
        redisClient.lrange('koral', 0, -1, function (err, rep) 
        {
            // rep - To get all the orders
            if (err) throw err;
            if (rep === null) return;
            // console.log("-> ", rep)
            for (let j = 0; j < rep.length; j++) {redisClient.lpop('koral');}
            // rep1 - To get all products in order
            for (let r = 0; r < rep.length; r++) {
                console.log(rep[r])
                redisClient.hgetall(rep[r], function (err, rep1) {
                    if (err) throw err;
                    if (rep1 === null){return;}
                    console.log(rep1)
                    insert(rep1)
                })
            }
        });
        await sleep(1000);
    }
}
start()
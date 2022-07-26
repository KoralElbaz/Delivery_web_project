const redis = require("redis");
const {sleep} = require("../help_function/myLibrary");
const redisClient = redis.createClient();

async function hget(key, val){
    let ans;
    redisClient.hget(key, val, function (err, rep) {
        if (err) throw err;
        if (rep === null) return;
        console.log(rep)
        ans = rep;
    })
    return ans;
}

console.log(hget('19402', 'price'))
sleep(3000).then(r => console.log(r))

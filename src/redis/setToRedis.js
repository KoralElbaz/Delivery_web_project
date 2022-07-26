const redis = require("redis");
const redisClient = redis.createClient();
function rpush(key, code){
    redisClient.rpush(key, code);
}

function hmset(key,key1, val1,key2=null,val2=null){
    if (key2 == null){
        redisClient.hmset(key, key1, val1);
    }
    else {
        redisClient.hmset(key, key1, val1, key2, val2);
    }
}



module.exports = {rpush, hmset}
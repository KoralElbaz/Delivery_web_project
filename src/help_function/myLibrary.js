const fs = require("fs");

/** get from json file */
 function getJson(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8')
        return JSON.parse(data)
        console.log(il[0])
    } catch (err) {
        console.error(err)
    }
}

/** get random element in range a - n */
 function getRandomElement(a, n) {
    return Math.floor(a + Math.random() * n);
}

/** delay */
 function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// put your path here
/** delete file */
 function deleteFile(fileName) {
    setTimeout(async function () {
        fs.unlink(fileName, function (err) {
            if (err) throw err;
            // console.log('File deleted!');
        });
    }, 1000);
}

const Northern = 'Northern', Southern = 'Southern', Central = 'Central', TelAviv = 'Tel Aviv', Jerusalem = 'Jerusalem', Haifa = 'Haifa', orderSize = 'size of order';


var prods = [{ Id:0, District: '',AllPrice: 0, City:''},
    { Id:0, District: '',AllPrice: 0, City:''},
    { Id:0, District: '',AllPrice: 0, City:''},
    { Id:0, District: '',AllPrice: 0, City:''}]

var sizeForChart = [{s:0, m:0, l:0, disId:Central, Total:0},
    {s:0, m:0, l:0, disId:Northern, Total:0},
    {s:0, m:0, l:0, disId:Southern, Total:0},
    {s:0, m:0, l:0, disId:TelAviv, Total:0},
    {s:0, m:0, l:0, disId:Haifa, Total:0},
    {s:0, m:0, l:0, disId:Jerusalem, Total:0}]

var data1 = {
    cards: [
        {color:'rose',districtId:Central, title: "מרכז", value: 0, unit: "חבילות", icon: "filter_1" },
        {color:'info',districtId:Northern, title: "צפון", value: 0, unit: "חבילות", icon: "filter_2" },
        {color:'success',districtId:Southern, title: "דרום", value: 0, unit: "חבילות", icon: "filter_3" },
        {color:'warning',districtId:TelAviv, title: "תל אביב", value: 0, unit: "חבילות", icon: "filter_4" },
        {color:'danger',districtId:Haifa, title: "חיפה", value: 0, unit: "חבילות", icon: "filter_5" },
        {color:'primary',districtId:Jerusalem, title: "ירושלים", value: 0, unit: "חבילות", icon: "filter_6" }
    ],
    prods,
    sizeForChart
}

module.exports = {deleteFile, sleep, getJson, getRandomElement, prods, sizeForChart, data1}
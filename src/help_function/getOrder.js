const {getJson, getRandomElement} =  require("./myLibrary");
const {setTime} = require("./setOrders");
const {setAddress, setPriceAndProduct, setSize, setTAX, setVAT} = require("./setOrders");

const Set = require('es6-set');
const used = new Set();
const citeis = getJson('./json_file/il.json')

/** return a random code */
function getCode() {
    const mil = 10000, bil = 90000;
    let randCode = getRandomElement(mil, bil);
    while (used.has(randCode)) {
        randCode = getRandomElement(mil, bil);
    }
    used.add(randCode);
    return randCode;
}

function getOrder(randCode){
    const order = {}

    let price = setPriceAndProduct(randCode);
    const randAddress = getRandomElement(0, citeis.length);
    const toCity = citeis[randAddress];
    setAddress(randCode, toCity);
    order['city'] = toCity.city;
    order['admin_name'] = toCity.admin_name;
    order['send_at'] = setTime();
    order['price'] = price;
    order['VAT'] = setVAT(randCode, price)
    order['TAX'] = setTAX(randCode, price)
    order['size_of_order'] = setSize(randCode, price)

    return order
}

module.exports = {getOrder, getCode}
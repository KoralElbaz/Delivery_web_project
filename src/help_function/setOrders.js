const {hmset, rpush}  = require("../redis/setToRedis");
const {getJson, getRandomElement} = require("./myLibrary");
const products = getJson('./json_file/products.json')
let products1 = {};
const numToFixed = 2;
const small = 75, medium = 500;
const orderSize = 'size_of_order';


/** return string of the current time*/
 function setTime() {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
}

/** return a random products to the order */
 function setPriceAndProduct(randCode) {
    const randProduct = getRandomElement(1, products.length / 3);
    let i = 0, price = 0;
    while (i < randProduct) {
        i++;
        let numOfProduct = getRandomElement(0, products.length);
        let pri = products[numOfProduct].price;
        let pro = products[numOfProduct].product;
        let nam2;
        if (products1[pro]) {
            nam2 = products1[pro]['Amount'] + 1
        } else {
            products1[pro] = {};
            nam2 = 1;
        }
        products1[pro]['Amount'] = nam2;
        products1[pro]['Price'] = pri;
        // hmset(randCode + 'Prod', pro + 'Amount', nam2, pro + 'Price', pri);
        hmset(randCode + 'Prod', i, pro );
        price += pri;
    }
    let p = parseFloat(price.toFixed(2))
    hmset(randCode, 'price', p);
    return p;
}


/** set the VAT */
 function setVAT(randCode, price) {
    //set VAT
    let VAT = 0;
    if (price > small) VAT = price * 0.17;
    VAT = VAT.toFixed(numToFixed);
    hmset(randCode, 'VAT', VAT);
    return VAT;
}

/** set the TAX */
 function setTAX(randCode, price) {
    //set tax 10% above 500$
    let TAX = 0;
    if (price > medium) TAX = price * 0.1

    TAX = TAX.toFixed(numToFixed);
    hmset(randCode, 'TAX', TAX);
    return TAX;
}

/** set the Size */
 function setSize(randCode, price) {
    //set size of order
    let s;
    if (price < small) s = 'small';
    else if (price < medium) s = 'medium';
    else s = 'big';
    hmset(randCode, orderSize, s);
    return s;
}

/** set an address to the order */
 function setAddress(randCode, toCity) {
    hmset(randCode, 'city', toCity.city)
    hmset(randCode, 'admin_name', toCity.admin_name)
}


module.exports = {setAddress, setVAT,setTAX,setSize,setTime,setPriceAndProduct}
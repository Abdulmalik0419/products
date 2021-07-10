const product = require('../data/data.json')

async function getProducts() {
    return new Promise(function(resolve, rejects) {
        resolve(products)
    })
}

module.exports = {
    getProducts
}
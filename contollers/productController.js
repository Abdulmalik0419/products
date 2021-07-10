const Product = require('../models/productModel')

async function getAllProduct(req, res) {
    try {
        const products = await Product.getProducts()
        res.writeHead(200, {'Content-type': 'text/json'})
        res.write(JSON.stringify(products))
        res.end();
    } catch (error) {
        console.log(error);
        res.writeHead(404, {'Content-type': 'text/plain'})
        res.end('invalid');
    }
}



module.exports = {
    getAllProducts
}



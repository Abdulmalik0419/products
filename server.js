const fs = require('fs')
const uuid = require('uuid')
const http = require('http')
const products = require('./data/data.json')


// const {getAllProducts} = require('./contollers/productController')
const server = http.createServer(function(req, res) {
    if (req.url === '/products' && req.method === 'GET') {
        const productPromise = new Promise((resolve, reject) => {
            resolve(products)
        })
        
        productPromise.then((data) => {
            res.writeHead(200, {'Content-type': 'text/json'})
            res.write(JSON.stringify(data))
            res.end();
        }).catch((error) => {
            res.writeHead(404, {'Content-type': 'text/json'})
            res.write(JSON.stringify(error))
            res.end()
        })
    } else if (req.url.match(/\/products\/\w+/) && req.method === 'GET') {
            const id = req.url.split('/')[2]
            const product = products.find((product) => product.id === id)
            if (!product) {
                res.writeHead(404, {'Content-type': 'text/json'})
                res.write(JSON.stringify({message: "Product not found"}))
            } else {
                res.writeHead(200, {'Content-type': 'text/json'})
                res.write(JSON.stringify(product))
            }
            res.end()
    } else if (req.url === '/products' && req.method === 'POST') {  
        const promise = new Promise((resolve, reject) => {
            let body = ''
            req.on('data', function(chunk) {
                body += chunk
            })
            req.on('end', function() {
                resolve(body)
            })
            req.on('error', function(err) {
                console.log(err)
                reject('Error')
            })
        })  
        promise.then((data) => {
            const productObj = JSON.parse(data)
            const product = {
                id: uuid.v4(),
                name: productObj.name,
                description: productObj.description,
                price: productObj.price
            }
            products.push(product)
            fs.writeFile('./data/data.json', JSON.stringify(products), 'utf8', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.writeHead(200, {'Content-type': 'text/json'})
                    res.write(JSON.stringify ({
                        message: "Product has been saved"
                    }))
                    res.end()
                }
            })
        })    
    } else if (req.url.match(/\/products\/\w++/) && req.method === 'PUT') {
        const id = req.url.split('/')[2]
        const product = products.find((product) => product.id === id)
        if (!product) {
            res.writeHead(404, {'Content-type': 'text/json'})
            res.write(JSON.stringify({message: "Product not found"}))
            res.end();
        } else {
            const promise = new Promise((resolve, reject) => {
                let body = ''
                req.on('data', function(chunk) {
                    body += chunk
                })
                req.on('end', function() {
                    resolve(body)
                })
                req.on('error', function(err) {
                    console.log(err)
                    reject('Error')
                })
                promise.then((data) => {
                    const { name, description, price} = JSON.parse(data)
                    let updatedProduct = {
                        name: name || product.name,
                        description: description || product.description,
                        price: price || product.price
                    }
                    let index = products.findIndex(p => p.id === id)

                    products[index] = {
                        id,
                        ...updatedProduct
                    }
                    fs.writeFile('./data/data.json'), JSON.stringify(products, null, 2), 'utf8', function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.writeHead(200, {'Content-type': 'text/json'})
                    res.write(JSON.stringify ({
                        message: "Product has been updated"
                    }))
                    res.end()
                        }
                    }      
                })
    }

    

server.listen(3000, () => console.log('Ok'))
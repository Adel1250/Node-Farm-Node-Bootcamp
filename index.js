const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemp = require("./modules/replaceTemp");

const data = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"));
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    if (pathname === '/' || pathname === "/overview") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const card = data.map(el => replaceTemp(tempCard, el));
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, card);
        res.end(output);
    }
    else if (pathname === "/product") {
        const product = data[query.id];
        const output = replaceTemp(tempProduct, product);
        res.end(output);
    }
    else if (pathname === "/api") {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    }
    else {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end(`<h1>Page not found!</h1>`);
    }
});

server.listen('8000', '127.0.0.1', () => {
    console.log("Listening on port 8000");
});
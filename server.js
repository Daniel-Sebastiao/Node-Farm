// Native Modules
const http = require('http');
const url = require('url');
const fs = require('fs');

// Own Modules
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    // Loading card throught the function replaceTemplate 👆🏾
    const cardHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join();
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const productID = dataObj[query.id];
    const output = replaceTemplate(tempProduct, productID);

    res.end(output);

    // API page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);

    // Not Found Page
  } else {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('<h1>Page Not Found!</h1>');
  }
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Server listenning on http://127.0.0.1:8080');
});

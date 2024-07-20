const functions = require('firebase-functions');
const express = require('express');
const rendertron = require('rendertron-middleware');

const app = express();

const rendertronMiddleware = rendertron.makeMiddleware({
  proxyUrl: 'https://render-tron.appspot.com/render' // Using the hosted Rendertron service
});

app.use(rendertronMiddleware);
app.use(express.static('public'));

exports.rendertron = functions.https.onRequest(app);


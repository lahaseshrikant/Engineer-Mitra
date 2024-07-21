const functions = require('firebase-functions');
const fetch = require('node-fetch');

const RENDERTRON_URL = 'https://engineer-mitra.appspot.com/render'; // Replace with your Rendertron instance URL

exports.rendertron = functions.https.onRequest((req, res) => {
  const url = `${RENDERTRON_URL}/${req.url}`;
  fetch(url)
    .then(response => response.text())
    .then(body => {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.status(200).send(body.toString());
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error rendering page');
    });
});

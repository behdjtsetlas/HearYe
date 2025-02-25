// server.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

// 1) Create an Express app
const app = express();

// 2) Define the /proxy route BEFORE serving the React app
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing url parameter.');
  }

  try {
    // If you're on Node < 18, you'll need to import 'node-fetch'
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/plain';
    const data = await response.text();

    // Set CORS headers so the browser can read the response
    res.header('Access-Control-Allow-Origin', '*');
    res.type(contentType);
    res.send(data);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).send('Error fetching URL.');
  }
});

// 3) Serve the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// 4) Fallback route for React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 5) Create an HTTPS server on port 443 with your SSL cert & key
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/hearye.news/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/hearye.news/fullchain.pem')
};

//https.createServer(options, app).listen(443, () => {
//  console.log('HTTPS server running on port 443');
//});
const PORT = 8080; // or something else
app.listen(PORT, () => {
  console.log(`CORS proxy listening on port ${PORT}`);
});

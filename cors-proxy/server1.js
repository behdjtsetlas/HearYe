// server.js
const https = require('https');
const express = require('express');
const app = express();
//const PORT = process.env.PORT || 8080;
const fs = require('fs');

// Load cert and key
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/hearye.news/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/hearye.news/fullchain.pem')
};

// Start an HTTPS server on port 443
https.createServer(options, app).listen(443, () => {
  console.log('Proxy server running on port 443 (HTTPS)');
});

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing URL parameter.');
  }

  try {
    // Use global fetch here
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/plain';
    const data = await response.text();
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', contentType);
    res.send(data);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).send('Error fetching URL.');
  }
});

//app.listen(PORT, () => {
//  console.log(`CORS proxy listening on port ${PORT}`);
//});

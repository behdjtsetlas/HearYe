// server.js
import protectedRoutes from './routes/protected.js';
import proxyRoutes from './routes/proxy.js';
const express = require('express');
const app = express();

// /proxy route for fetching external RSS
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing url parameter.');
  }

  try {
    // If Node < 18, install node-fetch and do: const fetch = require('node-fetch');
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/plain';
    const data = await response.text();

    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', contentType);
    res.send(data);
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).send('Error fetching URL.');
  }
});

app.use(proxyRoutes);

// Just listen on port 8080 with no HTTPS
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`CORS proxy listening on port ${PORT}`);
});

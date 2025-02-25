import express from 'express';
import proxyRoutes from './routes/proxy.js'; // your new consolidated route

const app = express();
app.use(proxyRoutes);

app.get('/api/proxy', async (req, res) => {
  // same logic
});

app.listen(8080, () => {
  console.log('CORS proxy listening on port 8080');
});

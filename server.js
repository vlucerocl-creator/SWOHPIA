const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  try {
    const { q, category, sort, limit, token } = req.query;
    let url = 'https://api.mercadolibre.com/sites/MLC/search?sort=' + (sort||'sold_quantity_desc') + '&limit=' + (limit||20);
    if (q) url += '&q=' + encodeURIComponent(q);
    if (category) url += '&category=' + category;
    const headers = { 'Authorization': 'Bearer ' + (token||'') };
    const r = await fetch(url, { headers });
    const data = await r.json();
    res.json(data);
  } catch(e) { res.status(500).json({error: e.message}); }
});

app.get('/api/trends/:catId', async (req, res) => {
  try {
    const url = req.params.catId === 'MLC'
      ? 'https://api.mercadolibre.com/trends/MLC'
      : 'https://api.mercadolibre.com/trends/MLC/' + req.params.catId;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch(e) { res.status(500).json({error: e.message}); }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));

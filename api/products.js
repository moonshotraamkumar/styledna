// StyleDNA — Product search via Etsy Open API v3
const ETSY_KEY = process.env.ETSY_API_KEY;

const STYLE_QUERIES = {
  'quiet-luxury':    ['cashmere sweater', 'minimal coat', 'silk blouse', 'tailored trousers'],
  'urban-edge':      ['oversized jacket', 'cargo pants', 'graphic tee', 'streetwear jacket'],
  'soft-minimalist': ['linen shirt', 'neutral dress', 'wide leg pants', 'minimalist top'],
  'boho-luxe':       ['floral maxi dress', 'boho top', 'suede boots', 'woven tote bag'],
  'editorial-chic':  ['structured blazer', 'statement coat', 'bold print dress', 'avant garde top'],
  'default':         ['fashion top', 'linen shirt', 'minimal jacket', 'trousers', 'loafers'],
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!ETSY_KEY) {
    return res.status(503).json({ error: 'ETSY_API_KEY not configured' });
  }

  const style = req.query.style || 'default';
  const queries = STYLE_QUERIES[style] || STYLE_QUERIES.default;
  const query = queries[Math.floor(Math.random() * queries.length)];

  try {
    const url = 'https://openapi.etsy.com/v3/application/listings/active?' +
      new URLSearchParams({
        keywords: query,
        limit: '16',
        sort_on: 'score',
        includes: 'Images',
      });

    const r = await fetch(url, { headers: { 'x-api-key': ETSY_KEY } });
    if (!r.ok) throw new Error(`Etsy ${r.status}: ${await r.text()}`);
    const data = await r.json();

    const products = (data.results || [])
      .filter(p => p.images?.length && p.price)
      .map(p => ({
        id:    p.listing_id,
        name:  p.title.length > 55 ? p.title.slice(0, 55) + '…' : p.title,
        brand: 'Etsy',
        price: parseFloat(p.price.amount) / p.price.divisor,
        img:   p.images[0]?.url_570xN || p.images[0]?.url_fullxfull,
        url:   p.url,
        match: Math.floor(78 + Math.random() * 18),
      }))
      .slice(0, 12);

    res.status(200).json({ products, query });

  } catch (err) {
    console.error('Etsy API error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

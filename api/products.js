// StyleDNA — Product search via Etsy Open API v3
const ETSY_KEY = process.env.ETSY_API_KEY;

const QUERIES = {
  women: ['womens fashion top', 'womens minimal dress', 'womens linen shirt', 'womens blazer', 'womens wide leg pants', 'womens loafers'],
  men:   ['mens fashion shirt', 'mens minimal jacket', 'mens linen trousers', 'mens blazer', 'mens chinos', 'mens chelsea boots'],
  all:   ['unisex fashion top', 'minimal linen shirt', 'oversized jacket', 'fashion sneakers', 'minimal coat', 'fashion trousers'],
};

const STYLE_SUFFIX = {
  'quiet-luxury':    'minimal luxury',
  'urban-edge':      'streetwear',
  'soft-minimalist': 'minimal clean',
  'boho-luxe':       'boho',
  'editorial-chic':  'editorial fashion',
  'default':         '',
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!ETSY_KEY) {
    return res.status(503).json({ error: 'ETSY_API_KEY not configured' });
  }

  const gender = req.query.gender || 'women';
  const style  = req.query.style  || 'default';

  const pool   = QUERIES[gender] || QUERIES.all;
  const suffix = STYLE_SUFFIX[style] || '';
  const base   = pool[Math.floor(Math.random() * pool.length)];
  const query  = suffix ? `${base} ${suffix}` : base;

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

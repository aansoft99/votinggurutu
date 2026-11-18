// /api/public.js  (Vercel Serverless Function)
// Env var di Vercel: APPS_SCRIPT_URL = URL Web App Apps Script (yang berakhiran /exec)
// Hasil di-cache di CDN Vercel selama 30 detik, jadi Google hanya dipanggil
// sekitar 1x per 30 detik, berapa pun jumlah usernya.
module.exports = async function handler(req, res) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 9000);
    const r = await fetch(process.env.APPS_SCRIPT_URL + '?action=public', {
      signal: ctl.signal,
      redirect: 'follow'
    });
    clearTimeout(timer);
    const j = await r.json();
    if (!j || !j.ok) throw new Error('Respon tidak valid');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=300, stale-if-error=3600'
    );
    res.status(200).json(j);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ ok: false, error: 'Server sibuk' });
  }
};

import express from 'express';
import { GoogleAuth } from 'google-auth-library';

const app = express();
const PORT = process.env.PORT || 8080;

const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL;

app.get('/token', async (req, res) => {
  try {
    const aud = req.query.aud;
    if (!aud) {
      return res.status(400).json({ error: 'audience (aud) query param required' });
    }

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(aud);

    const token = await client.idTokenProvider.fetchIdToken(aud);

    res.json({
      token,
      email: SERVICE_ACCOUNT_EMAIL,
      expires_in: 3600,
      aud
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`CloudMoon token service running on port ${PORT}`);
});

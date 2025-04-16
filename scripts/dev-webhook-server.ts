import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { POST } from '../src/api/stripe/webhook.js';

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

const app = express();
const port = 5176;

// Stripe requires raw body to verify signature
app.post('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response): Promise<void> => {
  console.log('✅ Webhook route triggered');

  try {
    const result = await POST({ request: req });
    console.log('📦 Webhook handler result:', result);

    if (!result || typeof result !== 'object' || typeof result.status !== 'number') {
      console.error('⚠️ Invalid response from POST handler:', result);
      res.status(500).send('Invalid response from webhook handler');
      return;
    }

    res.status(result.status);

    for (const [key, value] of Object.entries(result.headers)) {
      res.setHeader(key, value as string);
    }

    res.send(result.body);
  } catch (err) {
    console.error('🔥 Error handling webhook:', err);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`🚀 Webhook server running at http://localhost:${port}`);
});

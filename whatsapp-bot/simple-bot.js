/**
 * Simple WhatsApp message bot
 * Receives any message and replies with a short response.
 * Run: npm run simple
 */

const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-extensions',
      '--no-first-run',
      '--no-zygote',
    ],
  },
});

client.on('qr', (qr) => {
  console.log('\n--- Scan with WhatsApp: Linked Devices → Link a Device ---\n');
  qrcode.generate(qr, { small: true });
  const qrPngPath = path.join(__dirname, 'qr-scan.png');
  QRCode.toFile(qrPngPath, qr, { width: 400 }, (err) => {
    if (!err) console.log('QR saved to:', qrPngPath);
  });
});

client.on('ready', () => {
  console.log('\nSimple WhatsApp bot is ready. Message this number to get a reply.\n');
});

client.on('message', async (msg) => {
  if (msg.fromMe) return;
  const text = (msg.body || '').trim();
  await msg.reply(`Hi! You wrote: ${text || '(empty)'}`);
});

console.log('Starting simple WhatsApp bot... QR will appear in a few seconds.\n');
client.initialize().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});

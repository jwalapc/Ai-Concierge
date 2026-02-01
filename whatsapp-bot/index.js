const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const { flows, menuText, botIntro, getFlowByInput, formatRecommendation } = require('./data.js');

// In-memory state per chat: { flow, showedBest }
const state = new Map();
// When you "message yourself", messages come as fromMe=true. We still want to reply in that chat.
let myChatId = null;
const sentByUs = new Set(); // so we don't reply to our own messages in self-chat

async function replyTrack(msg, body) {
  const sent = await msg.reply(body);
  if (sent && sent.id) sentByUs.add(String(sent.id._serialized || sent.id));
  return sent;
}

// Use default (no remote webVersionCache) to avoid "Execution context was destroyed" on Windows.
// If QR shows but fails after scan, you can try adding webVersionCache again.
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
  console.log('\n--- Scan with your iPhone ---');
  console.log('WhatsApp → Settings (bottom) → Linked Devices → Link a Device');
  console.log('Then point your iPhone at this QR (or at qr-scan.png open on screen).\n');
  qrcode.generate(qr, { small: true });
  // Save QR as PNG next to this script (so it works no matter where you run from)
  const qrPngPath = path.join(__dirname, 'qr-scan.png');
  QRCode.toFile(qrPngPath, qr, { width: 400 }, (err) => {
    if (err) {
      console.error('Could not save QR image:', err.message);
    } else {
      console.log('QR image saved to:', qrPngPath);
    }
  });
});

client.on('ready', () => {
  myChatId = client.info.wid._serialized; // e.g. "919876543210@c.us" — needed so we reply when you message yourself
  console.log('\n========================================');
  console.log('  AI Concierge WhatsApp bot is READY.');
  console.log('========================================');
  console.log('');
  console.log('The bot is your linked "Chrome" device. There is no app window.');
  console.log('');
  console.log('TO CHAT WITH THE BOT:');
  console.log('  1. On your iPhone, open WhatsApp.');
  console.log('  2. Go to Chats and open the chat with YOURSELF (your own number).');
  console.log('     If you don\'t see it: Chats → search your number or use "Message yourself".');
  console.log('  3. Send:  menu');
  console.log('  4. You should get the menu. Then try:  1  or  2  or  3');
  console.log('');
  console.log('Keep this terminal open. When you message yourself, the bot replies here.');
  console.log('========================================\n');
});

client.on('message', async (msg) => {
  const chatId = msg.from;
  const text = (msg.body || '').trim();
  const fromMe = msg.fromMe;

  // Only reply in private (1:1) chats — never in groups. Stops "messages sent to random groups".
  if (String(chatId).endsWith('@g.us')) return;

  // When you "message yourself", WhatsApp sends those with fromMe=true. Still reply in that chat.
  if (fromMe && chatId !== myChatId) return;
  // Don't reply to our own sent messages (they echo back in self-chat)
  const msgId = msg.id && (msg.id._serialized || msg.id);
  if (msgId && sentByUs.has(String(msgId))) {
    sentByUs.delete(String(msgId));
    return;
  }

  const normalized = text.toLowerCase();

  // Yes/No handling when user is in a flow
  const current = state.get(chatId);
  if (current) {
    if (normalized === 'yes' || normalized === 'y') {
      const flow = flows[current.flow];
      const option = current.showedBest ? flow.best : flow.fallback;
      await replyTrack(msg,
        `✅ *Great choice!*\n\nHere’s how to proceed:\n${option.contact}\n\n_Reply_ *menu* _for more options._`
      );
      state.delete(chatId);
      return;
    }
    if (normalized === 'no' || normalized === 'n') {
      const flow = flows[current.flow];
      if (current.showedBest && flow.fallback) {
        await replyTrack(msg, formatRecommendation(current.flow, flow.fallback));
        state.set(chatId, { flow: current.flow, showedBest: false });
        return;
      }
      await replyTrack(msg, 'No problem. Reply *menu* to pick another category.');
      state.delete(chatId);
      return;
    }
  }

  // Greetings / Menu — proper bot intro so anyone messaging this number sees it's the bot
  const greetings = ['hi', 'hello', 'hey', 'hey there', 'yo', 'sup', 'whats up', 'how are you', 'menu', 'start', ''];
  if (!text || greetings.some((g) => normalized === g || normalized.startsWith(g))) {
    const isGreeting = /^(hi|hey|hello|yo|sup|whats? up|how are you)/i.test(normalized);
    if (isGreeting) {
      await replyTrack(msg, `${botIntro}\n\n${menuText}`);
    } else {
      await replyTrack(msg, `${botIntro}\n\n${menuText}`);
    }
    state.delete(chatId);
    return;
  }

  // Pick a flow: 1, 2, 3 or bouquet, car wash, quick bite
  const flowKey = getFlowByInput(text);
  if (flowKey) {
    const flow = flows[flowKey];
    const message = formatRecommendation(flowKey, flow.best);
    await replyTrack(msg, message);
    state.set(chatId, { flow: flowKey, showedBest: true });
    return;
  }

  // Unknown — keep it conversational, still show bot identity
  await replyTrack(msg, `${botIntro}\n\nNot sure what you meant — reply *menu* and I’ll show you: 1 Bouquet, 2 Car wash, 3 Quick bite.`);
});

console.log('Starting WhatsApp client... QR code (and qr-scan.png) will appear in a few seconds.\n');
client.initialize().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});

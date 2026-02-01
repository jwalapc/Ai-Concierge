/**
 * Hardcoded data for POC — 3 "Decision as a Service" flows.
 * Each flow has ONE best recommendation; we show it and ask Yes/No.
 */

// ——— Your bot number (for display in messages). The bot is whichever WhatsApp scans the QR.
// Put your number here, e.g. '+91 98765 43210' or '9876543210'. Leave '' to hide.
const BOT_NUMBER = '';

const bouquet = {
  keyword: 'bouquet',
  label: 'Bouquet / Flowers',
  best: {
    name: 'Bloom & Petals',
    reason: 'Best-rated for fresh flowers and same-day delivery in your area.',
    price: '₹599 – ₹1,499',
    contact: 'Order: 98765 43210 or visit bloomandpetals.in',
  },
  fallback: {
    name: 'Flora Express',
    reason: 'Good backup option with fixed timings.',
    price: '₹499 – ₹1,299',
    contact: 'Call 98765 43211',
  },
};

const carWash = {
  keyword: 'car wash',
  label: 'Car Wash',
  best: {
    name: 'Sparkle Auto Spa',
    reason: 'Closest to you, best reviews, quick service.',
    price: '₹299 (basic) / ₹599 (premium)',
    contact: 'Book: 98765 43212 or walk-in at MG Road',
  },
  fallback: {
    name: 'QuickShine Car Wash',
    reason: 'Budget-friendly, good for quick exterior wash.',
    price: '₹199',
    contact: '98765 43213',
  },
};

const quickBite = {
  keyword: 'quick bite',
  label: 'Quick Bite / Food',
  best: {
    name: 'The Corner Café',
    reason: 'Fast, great ratings, ideal for a quick sandwich or coffee.',
    price: '₹150 – ₹400',
    contact: 'Dine-in or order: 98765 43214, Indiranagar',
  },
  fallback: {
    name: 'Chai Point',
    reason: 'Reliable quick snacks and chai.',
    price: '₹50 – ₹200',
    contact: 'Multiple outlets, order on app',
  },
};

const flows = { bouquet, carWash, quickBite };

const botName = 'AI Concierge';
const botIntro = BOT_NUMBER
  ? `You're chatting with *${botName}* — your decision helper.\n_Number: ${BOT_NUMBER}_\n\nHere's what I can do:`
  : `You're chatting with *${botName}* — your decision helper. Here's what I can do:`;

const menuText = `
*🌐 ${botName} — Pick one*

Reply with a *number* or *keyword*:

*1* — Bouquet / Flowers  
*2* — Car Wash  
*3* — Quick Bite / Food  

_Example: send_ \`2\` _or_ \`car wash\`
`.trim();

// Words/phrases that mean the user wants bouquet, car wash, or quick bite
const bouquetWords = ['1', 'bouquet', 'bouquets', 'flowers', 'flower', 'florist', 'florists', 'i want a bouquet', 'need flowers', 'want flowers', 'get flowers', 'flower delivery', 'send flowers', 'gift flowers', 'roses', 'looking for bouquet', 'bouquet please'];
const carWashWords = ['2', 'car wash', 'carwash', 'wash car', 'wash my car', 'car cleaning', 'clean my car', 'need car wash', 'want car wash', 'car wash please', 'auto wash'];
const quickBiteWords = ['3', 'quick bite', 'quickbite', 'food', 'bite', 'eat', 'eating', 'hungry', 'snack', 'snacks', 'lunch', 'breakfast', 'something to eat', 'want food', 'need food', 'get food', 'quick eat', 'cafe', 'coffee and snack'];

function getFlowByInput(text) {
  const t = (text || '').toLowerCase().trim();
  if (bouquetWords.some((k) => t === k || t.includes(k))) return 'bouquet';
  if (carWashWords.some((k) => t === k || t.includes(k))) return 'carWash';
  if (quickBiteWords.some((k) => t === k || t.includes(k))) return 'quickBite';
  return null;
}

function formatRecommendation(flowKey, option) {
  const flow = flows[flowKey];
  const label = flow?.label || flowKey;
  return `
*✅ Your 1 best pick — ${label}*

*${option.name}*
${option.reason}

💰 ${option.price}
📞 ${option.contact}

Reply *YES* to confirm or *NO* for another option.
  `.trim();
}

module.exports = {
  flows,
  menuText,
  botIntro,
  botName,
  BOT_NUMBER,
  getFlowByInput,
  formatRecommendation,
};

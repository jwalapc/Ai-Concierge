# Ai Concierge

Hyper-local consumer **AI Concierge** — Decision as a Service (bouquet, car wash, quick bite) with a WhatsApp bot POC.

---

## What’s in this repo

| Item | Description |
|------|-------------|
| **[FUNDABILITY-ASSESSMENT.md](./FUNDABILITY-ASSESSMENT.md)** | Fundability summary: market, moats, funding path, strategy. |
| **[ACTION-PLAN.md](./ACTION-PLAN.md)** | Pre-seed action plan and checklist. |
| **[whatsapp-bot/](./whatsapp-bot/)** | WhatsApp bot POC: 3 flows (bouquet, car wash, quick bite), one decision + Yes/No. See [whatsapp-bot/README.md](./whatsapp-bot/README.md) for run and test steps. |

---

## Quick start (WhatsApp bot)

```bash
cd whatsapp-bot
npm install
npm start
```

Scan the QR with WhatsApp on the number you want to use as the bot. Then message that number (or yourself) with:

- **menu** — show options  
- **hey** / **hi** — greeting + menu  
- **I want a bouquet** — bouquet recommendation → YES/NO  
- **car wash** / **wash my car** — car wash recommendation  
- **something to eat** / **3** — quick bite recommendation  

Full details: [whatsapp-bot/README.md](./whatsapp-bot/README.md).

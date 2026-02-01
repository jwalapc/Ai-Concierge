# AI Concierge — WhatsApp POC

Small **Decision as a Service** POC on WhatsApp with **3 flows** and **hardcoded data**:

1. **Bouquet / Flowers** — 1 best pick (e.g. Bloom & Petals) → Yes / No  
2. **Car Wash** — 1 best pick (e.g. Sparkle Auto Spa) → Yes / No  
3. **Quick Bite / Food** — 1 best pick (e.g. The Corner Café) → Yes / No  

Each flow gives **one final recommendation**. User replies **YES** to confirm or **NO** to see another option (fallback), then Yes/No again.

---

## How this bot works

**In one sentence:** Your PC runs a Node.js script that acts as a **linked WhatsApp “device”** (like WhatsApp Web). When someone messages your number, the script gets the message, decides the reply, and sends it back — so your number behaves like an automated bot.

**Step by step:**

1. **Linking**  
   You run `npm start` on your PC. The script uses **whatsapp-web.js** to open a headless browser (Chrome) and load WhatsApp Web. It shows a **QR code**. You scan that QR with WhatsApp on the phone that has the number you want to use as the bot. That number is now “linked” to this script — the script is like an extra device for that WhatsApp account (like WhatsApp Web in a browser).

2. **When someone messages your number**  
   WhatsApp delivers the message to all linked devices: the phone, WhatsApp Web (if open), and **our script**. The script receives the message in Node.js (e.g. “hi”, “I want a bouquet”).

3. **How the script decides what to reply**  
   - **Greetings** (hi, hey, menu, etc.) → reply with bot intro + menu (1 Bouquet, 2 Car wash, 3 Quick bite).  
   - **Keywords** (bouquet, flowers, car wash, food, etc.) → reply with the **one best recommendation** for that category and ask YES/NO.  
   - **YES/NO** (when we already showed a recommendation) → confirm with contact details, or show the fallback option.  
   - **Anything else** → “Not sure what you meant — reply *menu*…”.

4. **Sending the reply**  
   The script calls the WhatsApp API (via whatsapp-web.js) to send the reply in the same chat. The user sees it on their phone (or WhatsApp Web) as a normal message from your number.

**Where things live:**

| Part | Role |
|------|------|
| **index.js** | Starts the WhatsApp client, handles QR & “ready”, and **every incoming message**: decides what to send and sends it (menu, recommendation, YES/NO). |
| **data.js** | All content and rules: menu text, bot intro, the 3 flows (bouquet, car wash, quick bite) with best/fallback options, and **keyword lists** so phrases like “I want a bouquet” map to the right flow. |
| **.wwebjs_auth/** | Saved session so you don’t have to scan the QR again after the first time. |

**No WhatsApp Business API.** This uses the same “linked device” approach as WhatsApp Web (your number + a second “device” controlled by the script). For a proper business line and high volume you’d use Meta’s WhatsApp Business API later.

**Groups:** The bot **ignores group chats**. It only replies in **private (1:1) chats** and in the “message yourself” chat. That way it won’t send messages to random groups when people chat there.

---

## Prerequisites

- **Node.js 18+**
- A **WhatsApp** account: you need a **phone number** (for registration) and something that can **scan the QR** (phone or Android emulator — see below if you don’t have a phone).

---

## I don’t have a phone — use an Android emulator on PC

WhatsApp needs a number and a “device” to scan the QR. If you don’t have a physical phone:

1. **Install an Android emulator** on your PC, e.g.:
   - **BlueStacks** — https://www.bluestacks.com  
   - **LDPlayer** — https://www.ldplayer.net  
   - **Android Studio AVD** (Developer → Virtual Device)
2. **Install WhatsApp** inside the emulator (from the Play Store or APK).
3. **Register WhatsApp** with a number that can receive SMS/call for the OTP (e.g. a friend’s number for one-time code, or a virtual number if WhatsApp accepts it).
4. **Start the bot** on your PC (`npm start`), then **scan the QR** using WhatsApp inside the emulator: **Settings → Linked devices → Link a device** and point the emulator’s “camera” at the QR on your screen (or at **qr-scan.png**).
5. After linking, you can chat with the bot from **WhatsApp Web** in your browser (no need to use the emulator for typing).

You still need a **phone number** for WhatsApp sign-up; the emulator replaces the **physical phone** for scanning and (optionally) for using WhatsApp.

---

## Run

```bash
cd whatsapp-bot
npm install
npm start
```

1. Terminal will show a **QR code** (and save **qr-scan.png** in the folder).  
2. On your **iPhone**: **WhatsApp** → **Settings** (bottom right) → **Linked Devices** → **Link a Device** → point your iPhone at the QR.  
3. **Easier:** Open **qr-scan.png** on your computer (in the `whatsapp-bot` folder), make it full screen, then scan it with WhatsApp’s “Link a Device” scanner on your iPhone.  
4. **Chat with the bot** — The bot is your linked Chrome device (no app window). On iPhone: WhatsApp → Chats → open the chat with **yourself**. Send **menu** there; then **1**, **2**, **3**. Or message your number from another phone.

---

## Using your number as the bot (proper bot)

**Your number becomes the bot** when you link it:

1. Run the bot on your PC (`npm start`) and scan the QR with **the WhatsApp account you want to use as the bot** (your number).
2. That number is now the bot: **anyone who messages that number** gets automated replies (menu, bouquet / car wash / quick bite, YES/NO).
3. You can use:
   - **Your personal number** — then your number is the bot; you’ll see bot chats on your phone/WhatsApp Web.
   - **A dedicated number** (e.g. second SIM or second phone) — install WhatsApp on that device, register with that number, then scan the bot’s QR from that device. That number becomes the bot; your personal number stays separate.

Replies now start with *"You're chatting with AI Concierge — your decision helper..."* so it’s clear it’s a bot.

**To use your number:** In `data.js` set `BOT_NUMBER` to your number (e.g. `'+91 98765 43210'`). Then run `npm start` and **scan the QR with WhatsApp on that number** — that number becomes the bot. The bot will show your number in the intro so people know which number to message. Change `botName` / `botIntro` in `data.js` if you want.

---

## How to test on your mobile (iPhone / Android)

1. **On your PC:** Open terminal in the project folder and run:
   ```bash
   cd whatsapp-bot
   npm start
   ```
   Leave this terminal open. Wait until you see **"AI Concierge WhatsApp bot is READY."**

2. **On your phone:** Open **WhatsApp** → **Settings** (or ⋮ menu) → **Linked devices** → **Link a device**.  
   Scan the QR code (from the terminal or from **qr-scan.png** on your PC).  
   Your phone is now linked; you may see **"Chrome"** or **"Desktop"** under Linked devices.

3. **Chat with the bot on your phone:**
   - Go to **Chats**.
   - Open the chat with **yourself** (your own number).  
     - *iPhone:* Search your number or use **Message yourself** if you see it.  
     - *Android:* New chat → search your phone number.
   - In that chat, send any of these to test:
     - **hey** or **hi** → friendly reply + menu  
     - **menu** → full menu (1 Bouquet, 2 Car wash, 3 Quick bite)  
     - **I want a bouquet** → bouquet recommendation → YES/NO  
     - **car wash** or **wash my car** → car wash recommendation  
     - **something to eat** or **3** → quick bite recommendation  

4. Replies from the bot will appear in that same chat on your mobile. Keep the PC terminal running while you test.

---

## How to test in WhatsApp Web (browser)

1. **Start the bot** on your PC (`npm start`) and scan the QR with your phone so the bot is linked.
2. In your **browser**, go to **https://web.whatsapp.com**.
3. If WhatsApp Web isn’t linked yet, it will show a QR → scan it with your phone (**Linked devices** → **Link a device**). You can have both the bot and WhatsApp Web linked.
4. In WhatsApp Web, open the chat with **yourself** (your number / “Message yourself” / Saved messages).
5. Send **menu**, **hey**, or **I want a bouquet** — the bot will reply and you’ll see the replies in the browser. Keep the terminal running.

---

## Commands (what to send)

| Send        | Result                                      |
|------------|---------------------------------------------|
| `menu` / `hi` | Main menu: 1 Bouquet, 2 Car wash, 3 Quick bite |
| `1` or `bouquet` | 1 best bouquet recommendation → Yes/No     |
| `2` or `car wash` | 1 best car wash recommendation → Yes/No   |
| `3` or `quick bite` | 1 best quick bite recommendation → Yes/No |
| `YES` / `NO` | After a recommendation: confirm or get fallback |

---

## Edit hardcoded data

- **Flows & options:** `data.js` — change `bouquet`, `carWash`, `quickBite` (names, reasons, prices, contact).
- **Bot number & intro:** `data.js` — `BOT_NUMBER` (e.g. `'+91 98765 43210'`), `botName`, `botIntro`.
- **Menu text:** `data.js` — `menuText`.
- **Logic:** `index.js` — message handling and Yes/No behaviour.

---

## Auth

Session is stored in `.wwebjs_auth/`. Delete that folder to log out and show a new QR on next run.

---

## If you see "Execution context was destroyed" or "Protocol error"

1. **Clear the session** — Delete the `.wwebjs_auth` folder in `whatsapp-bot`, then run `npm start` again and scan a fresh QR.
2. **Run from the bot folder** — Always `cd whatsapp-bot` before `npm start`.
3. If it still fails, try closing other apps to free memory, or run: `npm start` again after a minute.

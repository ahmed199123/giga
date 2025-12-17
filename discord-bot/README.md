# Discord Bot 🤖

## Replit - خطوة بخطوة

### 1. إنشاء البوت على Discord

1. روح على: https://discord.com/developers/applications
2. اضغط **"New Application"** > سمّيه > Create
3. من القائمة اضغط **"Bot"**
4. اضغط **"Reset Token"** > انسخ التوكن (احفظه!)
5. فعّل **MESSAGE CONTENT INTENT** ✅
6. روح **"OAuth2"** > **"URL Generator"**
7. Scopes: اختر `bot`
8. Bot Permissions: `Send Messages`, `Read Message History`
9. انسخ الرابط من الأسفل > افتحه > أضف البوت للسيرفر

---

### 2. إعداد Replit

1. روح على: https://replit.com
2. سجل دخول بـ Google أو GitHub
3. اضغط **"+ Create Repl"**
4. Template: **Node.js**
5. Title: `discord-bot`
6. اضغط **"Create Repl"**

---

### 3. الصق الكود

**في `index.js`** الصق كود البوت (الموجود في هذا الفولدر)

**في `package.json`** الصق:
```json
{
  "name": "discord-bot",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1"
  }
}
```

---

### 4. أضف التوكن

1. في Replit اضغط على 🔒 **"Secrets"** (في الشريط الجانبي)
2. Key: `DISCORD_TOKEN`
3. Value: الصق التوكن
4. اضغط **"Add Secret"**

---

### 5. شغّل البوت

اضغط **Run** ▶️

لازم يظهر:
```
🌐 Keep-alive server running on port 3000
✅ البوت شغال! BotName#1234
```

---

## 🔄 تشغيل 24/7 مجاناً (UptimeRobot)

Replit بينام بعد فترة من عدم النشاط. الحل:

### 1. انسخ رابط الـ Webview

- في Replit فوق، هتلاقي رابط زي:
  `https://discord-bot.username.repl.co`
- انسخه

### 2. إعداد UptimeRobot

1. روح على: https://uptimerobot.com
2. سجل حساب مجاني
3. اضغط **"+ Add New Monitor"**
4. Monitor Type: **HTTP(s)**
5. Friendly Name: `Discord Bot`
6. URL: الصق رابط Replit
7. Monitoring Interval: **5 minutes**
8. اضغط **"Create Monitor"**

---

## ✅ خلاص!

UptimeRobot هيعمل ping للبوت كل 5 دقائق، فهيفضل شغال 24/7!

---

## الأوامر المتاحة

| الأمر | الوظيفة |
|-------|---------|
| اهلا / مرحبا | رد ترحيبي |
| hello / hi | English greeting |
| !ping | اختبار السرعة |
| !help | عرض الأوامر |

const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

// سيرفر بسيط عشان UptimeRobot يعمل ping
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
}).listen(3000, () => {
    console.log('🌐 Keep-alive server running on port 3000');
});

// إنشاء البوت
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// لما البوت يشتغل
client.once('ready', () => {
    console.log(`✅ البوت شغال! ${client.user.tag}`);
});

// لما حد يرسل رسالة
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    if (content === 'اهلا' || content === 'هلا' || content === 'مرحبا') {
        await message.reply('أهلاً وسهلاً! 👋 كيف حالك؟');
    }
    
    if (content === 'hello' || content === 'hi') {
        await message.reply('Hello! 👋 How are you?');
    }

    if (content === '!ping') {
        await message.reply(`🏓 Pong! ${client.ws.ping}ms`);
    }

    if (content === '!help') {
        await message.reply(`
**الأوامر المتاحة:**
• اهلا / مرحبا - رد ترحيبي
• hello / hi - English greeting
• !ping - اختبار السرعة
• !help - عرض الأوامر
        `);
    }
});

// تشغيل البوت
client.login(process.env.DISCORD_TOKEN);

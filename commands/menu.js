// commands/menu.js
const fs = require('fs');
const path = require('path');

module.exports = {
    cmd: "menu",
    // Description: Menampilkan menu bot.
    handle: async (sock, msg, logger) => { // Terima logger
        // --- Bagian Header ---
        const botName = global.botName;
        const ownerName = global.owner.name;
        const uptime = process.uptime();

        function formatUptime(seconds) {
            const days = Math.floor(seconds / (3600 * 24));
            seconds -= days * 3600 * 24;
            const hours = Math.floor(seconds / 3600);
            seconds -= hours * 3600;
            const minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
            return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${Math.floor(seconds)} Detik`;
        }

        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            timeZone: global.timezone,
           // locale: global.locale // Hapus baris ini, gunakan default
        };
        const dateTimeString = now.toLocaleString(options); // Hapus global.locale

        let features = "";
        const commandDir = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(path.join(commandDir, file));
            if (command.cmd === 'menu') continue;

            const filePath = path.join(commandDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const descriptionMatch = fileContent.match(/\/\/\s*Description:\s*(.*)/);
            const description = descriptionMatch ? descriptionMatch[1].trim() : `Gunakan ${global.prefixCommand}${command.cmd}`;

            features += `• *${global.prefixCommand}${command.cmd}*: ${description}\n`;
        }

        const menuMessage = `
┌───⭓ *${botName}* 🤖
│
├─── ⭓ *Info Bot*
│   • *Owner:* ${ownerName}
│   • *Tanggal & Waktu:* ${dateTimeString}
│   • *Uptime:* ${formatUptime(uptime)}
│
├─── ⭓ *Daftar Perintah*
${features}
└───⭓
        `.trim();

        try {
          const imagePath = path.join(__dirname, '..', global.image.logo); // Path relatif

          if (fs.existsSync(imagePath)) {
            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    image: { url: imagePath },
                    caption: menuMessage,
                },
                { quoted: msg }
            );
          }
          else {
            await sock.sendMessage(msg.key.remoteJid, { text: menuMessage }, { quoted: msg });
          }
        } catch (error) {
            console.error("Error sending menu:", error);
            logger.error("Error sending menu:", error); // Gunakan logger
            await sock.sendMessage(msg.key.remoteJid, { text: menuMessage }, { quoted: msg });
        }
    }
};

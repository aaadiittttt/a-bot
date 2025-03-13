// commands/ttnowm.js
const axios = require('axios');

module.exports = {
    cmd: "tt",
    // Description: Download video TikTok noWM.
    handle: async (sock, msg, logger) => {
        const tiktokUrl = msg.args[0];

        if (!tiktokUrl) {
            return msg.reply(global.mess.error.invalidUrl);
        }

        // Validasi URL (opsional, bisa diperluas)
        if (!tiktokUrl.includes("tiktok.com")) {
            return msg.reply("URL TikTok tidak valid.");
        }

        try {
            const response = await axios.post(
                "https://tikwm.com/api/",
                { url: tiktokUrl, count: 12, cursor: 0, hd: 1 }, // Data yang dikirim (POST)
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', // Header penting!
                        // Tidak perlu API key untuk TikWM
                    },
                }
            );

            const data = response.data;
            logger.info("[TTNOWM] API Response:", data);

            if (response.status === 200 && data.code === 0 && data.data && data.data.play) {
                const videoUrl = data.data.play; // URL video tanpa watermark
                const caption = data.data.title || "Video TikTok"; // Judul video

                await sock.sendMessage(
                    msg.key.remoteJid,
                    { video: { url: videoUrl }, caption: caption },
                    { quoted: msg }
                );

            } else if (data.code !== 0) { // TikWM menggunakan 'code' untuk status
                msg.reply(`Gagal mengunduh video TikTok: ${data.msg || 'Unknown error'}`); // Pesan error dari API

            } else {
                logger.warn("[TTNOWM] Unexpected API response structure:", data);
                msg.reply("Gagal mengunduh video TikTok. Periksa URL dan coba lagi.");
            }

        } catch (error) {
            console.error("Error downloading TikTok video:", error);
            logger.error("[TTNOWM] Error:", error);

            if (error.response) {
                logger.error("[TTNOWM] Error Response Data:", error.response.data);
                logger.error("[TTNOWM] Error Response Status:", error.response.status);
                logger.error("[TTNOWM] Error Response Headers:", error.response.headers);

                // Pesan error yang lebih spesifik (jika ada)
                msg.reply(`Terjadi kesalahan: ${error.response.data.msg || error.response.statusText || "Unknown API Error"}`);

            } else if (error.code === 'ECONNREFUSED') { // Masalah koneksi
                msg.reply("Tidak dapat terhubung ke server TikWM. Coba lagi nanti.");
            } else if (error.code === 'ETIMEDOUT') { // Timeout
                msg.reply("Koneksi ke server TikWM timeout. Coba lagi.");
            } else {
                msg.reply(global.mess.error.general); // Pesan error umum
            }
        }
    }
};

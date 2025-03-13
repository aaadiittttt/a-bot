// commands/igdl.js
const axios = require('axios');

module.exports = {
    cmd: "igdl",
    // Description: Download konten Instagram.
    handle: async (sock, msg, logger) => {
        const igUrl = msg.args[0];

        if (!igUrl) {
            return msg.reply(global.mess.error.invalidUrl);
        }

        if (!igUrl.startsWith("https://www.instagram.com/")) {
            return msg.reply("URL Instagram tidak valid.");
        }

        try {
            const options = {
                method: 'GET',
                url: 'https://instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com/scraper',
                params: {
                    url: igUrl
                },
                headers: {
                    'x-rapidapi-key': global.api.rapid,
                    'x-rapidapi-host': 'instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            const data = response.data;

            logger.info("[IGDL] API Response:", data);

            if (response.status === 200 && data.data && Array.isArray(data.data)) { // Perubahan di sini
                for (const item of data.data) { // Loop melalui data.data
                    if (item.isVideo === false && item.media) { // Perubahan di sini
                        await sock.sendMessage(
                            msg.key.remoteJid,
                            { image: { url: item.media }, caption: "Instagram Post" }, // Caption dari item (jika ada)
                            { quoted: msg }
                        );
                    } else if (item.isVideo === true && item.media) { // Perubahan di sini
                        await sock.sendMessage(
                            msg.key.remoteJid,
                            { video: { url: item.media }, caption: "Instagram Video" },  //Caption dari item
                            { quoted: msg }
                        );
                    } else {
                        logger.warn("[IGDL] Unknown media type:", item);
                    }
                }
            } else {
                msg.reply("Gagal mengunduh konten Instagram. Periksa URL dan coba lagi, atau API sedang bermasalah.");
            }

        } catch (error) {
            console.error("Error downloading Instagram content:", error);
            logger.error("[IGDL] Error:", error);

            if (error.response) {
                logger.error("[IGDL] Error Response Data:", error.response.data);
                logger.error("[IGDL] Error Response Status:", error.response.status);
                logger.error("[IGDL] Error Response Headers:", error.response.headers);

                if (error.response.status === 400) {
                    msg.reply("URL Instagram tidak valid (400 Bad Request).");
                } else if (error.response.status === 404) {
                    msg.reply("Konten Instagram tidak ditemukan (404 Not Found).");
                } else if (error.response.status === 429) {
                    msg.reply("Batas penggunaan API tercapai (429 Too Many Requests). Coba lagi nanti.");
                } else {
                    msg.reply(`Terjadi kesalahan: ${error.response.data.message || error.response.statusText || "Unknown API Error"}`);
                }
            } else {
                msg.reply(global.mess.error.general);
            }
        }
    }
};

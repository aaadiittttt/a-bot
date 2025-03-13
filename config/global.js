const fs = require("fs");

// --- INFORMASI BOT ---
global.botName = "A-BOT V1";  // Ganti dengan nama bot Anda
global.botNumber = "62895382509975"; // GANTI DENGAN NOMOR BOT ANDA (untuk pairing code)
global.useCode = true; // Ganti menjadi true jika ingin pairing code

// --- INFORMASI OWNER ---
global.owner = {
    name: "A",  // Ganti dengan nama Anda
    number: "6285757571072", // GANTI DENGAN NOMOR OWNER ANDA
    social: [ //HAPUS JIKA TIDAK PERLU
        {
            name: "github",
            url: "https://github.com/aaadiittttt", // GANTI/HAPUS
        },
        {
            name: "instagram",
            url: "https://instagram.com/aditttmhj_" // GANTI/HAPUS
        }
    ],
};

// --- PENGATURAN ---
global.useStore = true; // Apakah menggunakan in-memory store?
global.online = true;    // Apakah bot online saat pertama dijalankan?
global.prefixCommand = "."; // Prefix command
global.splitArgs = "|";  // pemisah argumen
global.locale = "id-ID"; // GANTI JIKA INGIN MENGGUNAKAN LOCALE LAIN, HAPUS JIKA INGIN DEFAULT
global.timezone = "Asia/Jakarta"; //GANTI JIKA PERLU
global.inviteCode = "";  // Kode invite grup (kosongkan jika tidak ada)

// --- API ---
global.api = {
    rapid: '019b36048emsh1ecb3b261a8594fp160cf0jsnf71118024d7f' // GANTI DENGAN API KEY RAPIDAPI ANDA (ttsave)
};


// --- GAMBAR ---
global.image = {
    logo: "images/logo.png", // PATH RELATIF KE GAMBAR LOGO (dari index.js)
};

// --- SETTING (DARI FILE JSON) ---
global.setting = JSON.parse(fs.readFileSync("./config/setting.json"));

// --- FUNGSI UNTUK MENYIMPAN SETTING ---
global.saveSetting = async (data) => {
    try {
        await fs.promises.writeFile("./config/setting.json", JSON.stringify(data, null, 2));
        global.setting = data;
        return data;
    } catch (err) {
        console.error("Error saving setting:", err);
        throw err;
    }
};

// --- PESAN-PESAN ---
global.mess = {
    dev: "Masih dalam tahap pengembangan",
    error: {
        general: "Terjadi kesalahan.",
        commandNotFound: "Perintah tidak ditemukan.",
        apiError: "Terjadi kesalahan pada API.",
        noResult: "Tidak ditemukan hasil.",
        invalidUrl: "URL tidak valid.",
        noMedia: "Tidak dapat mengunduh media dari URL ini.",
        stickerError: "Gagal membuat stiker.",
        noQuery: "Silakan masukkan kata kunci pencarian.", // Tidak terpakai karena tiktoksearch dihapus
        noImage: "Format salah, kirim/reply gambar dengan caption .sticker"

    },
    success: {
        // ... (tambahkan pesan sukses jika perlu) ...
    },
};

// --- MODE ---
global.dev = process.env.NODE_ENV === "development"; //Biasanya untuk mode development

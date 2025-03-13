# Wabase V3 - WhatsApp Bot

Wabase V3 adalah bot WhatsApp yang dibuat menggunakan Node.js dan library [Baileys](https://github.com/WhiskeySockets/Baileys). Bot ini dapat mendownload video TikTok tanpa watermark, mendownload postingan Instagram, dan memiliki command menu.

## Fitur

*   **`.ttnowm <tiktok_url>`:** Download video TikTok tanpa watermark.
*   **`.igdl <instagram_url>`:** Download postingan Instagram (gambar atau video).
*   **`.menu`:** Menampilkan daftar perintah yang tersedia.

## Prasyarat

*   **Node.js:** Versi 18 atau lebih baru. Anda bisa mendownloadnya dari [https://nodejs.org/](https://nodejs.org/).
*   **npm:**  Biasanya sudah terinstall bersama Node.js.
*   **Akun WhatsApp:**  Anda memerlukan nomor WhatsApp yang *tidak* terhubung ke akun WhatsApp Business.
*   **RapidAPI Account dan API Key:**
    *   Buat akun di [RapidAPI](https://rapidapi.com/).
    *   Berlangganan API "TikTok Download Without Watermark (ttsave)": [https://rapidapi.com/ttsave/api/tiktok-download-without-watermark/](https://rapidapi.com/ttsave/api/tiktok-download-without-watermark/)
    *   Berlangganan API "Instagram Downloader Scraper": [https://rapidapi.com/yuanan0008/api/instagram-downloader-scraper-reels-igtv-posts-stories](https://rapidapi.com/yuanan0008/api/instagram-downloader-scraper-reels-igtv-posts-stories)
    *   Dapatkan API key Anda dari dashboard RapidAPI.

## Instalasi

1.  **Clone Repositori:**

    ```bash
    git clone [https://github.com/aaadiittttt/a-bot.git](https://github.com/aaadiittttt/a-bot.git)
    cd a-bot
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Konfigurasi:**

    *   Buat file `config/setting.json` dan isi dengan:

    ```json
    {
        "selfmode": false
    }
    ```
     *   Buka file `config/global.js`.
    *   Ganti *placeholder* dengan informasi yang benar:
        *   `global.botName`: Nama bot Anda.
        *   `global.botNumber`: Nomor WhatsApp bot Anda (tanpa "+" dan spasi), *hanya jika* Anda menggunakan pairing code.
        *   `global.useCode`: `true` untuk pairing code, `false` untuk QR code.
        *   `global.owner.name`: Nama Anda.
        *   `global.owner.number`: Nomor WhatsApp Anda (tanpa "+" dan spasi).
        *   `global.api.rapid`:  API key RapidAPI Anda.
        *   `global.image.logo`: Path ke file logo bot Anda (opsional).

4. **Jalankan Bot**
    ```bash
      npm start
    ```
   * Jika anda menggunakan pairing code, masukkan nomor bot anda ke terminal, lalu masukkan kode pairing yang muncul ke aplikasi whatsapp di HP anda.
   * Jika anda menggunakan QR code, scan QR code menggunakan whatsapp di HP anda.

## Penggunaan

Kirim pesan ke nomor WhatsApp bot Anda dengan format:

.<command> [argumen]

Contoh:

*   `.ttnowm https://www.tiktok.com/@username/video/12345`
*   `.igdl https://www.instagram.com/p/abcdefg/`
*   `.menu`

**Daftar Perintah:**

| Perintah      | Deskripsi                                        | Contoh Penggunaan                             |
| ------------- | ------------------------------------------------ | --------------------------------------------- |
| `.ttnowm`     | Download video TikTok tanpa watermark.          | `.ttnowm <tiktok_url>`             |
| `.igdl`       | Download postingan Instagram (gambar atau video). | `.igdl <instagram_url>`          |
| `.menu`       | Menampilkan daftar perintah.                      | `.menu`                                       |

## Kontribusi

Kontribusi dipersilakan! Jika Anda ingin berkontribusi, silakan buat *fork* dari repositori ini, buat perubahan, dan ajukan *pull request*.

## Lisensi

[MIT License](LICENSE)  (Anda perlu membuat file `LICENSE` sendiri)

## Disclaimer

*   Bot ini menggunakan API pihak ketiga. Pastikan Anda mematuhi *terms of service* dari API tersebut.
*   Gunakan bot ini dengan bijak dan bertanggung jawab.
*   Pengembang tidak bertanggung jawab atas penyalahgunaan bot ini.

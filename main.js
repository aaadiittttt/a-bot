// index.js
require("./config/global");
const path = require("path");
const fs = require("fs");
const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    Browsers,
    makeCacheableSignalKeyStore,
    isJidStatusBroadcast,
    isJidGroup,
    getContentType,
    makeInMemoryStore
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");

// Import utilities
const sleep = require("./utils/sleep");
const logger = require("./utils/logger");

const AUTH_FILE_LOCATION = './sezz';

const store = global.useStore ? makeInMemoryStore({ logger: logger }) : undefined;
if (store) {
    store.readFromFile('./baileys_store_multi.json');
    setInterval(() => {
        store.writeToFile('./baileys_store_multi.json');
    }, 10000);
}


// Fungsi untuk memuat command (dengan error handling)
function loadCommands() {
    const commandDir = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));
    const commands = new Map();

    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandDir, file));
            commands.set(command.cmd, command);
            logger.info(`[COMMAND] ${command.cmd} loaded`);
        } catch (error) {
            logger.error(`Gagal memuat command ${file}:`, error);
            // Jangan reject, lanjutkan
        }
    }
    return commands;
}

const commands = loadCommands();
let sock; // Deklarasi sock


async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FILE_LOCATION);

    // Cek apakah sudah ada instance sock
    if (sock) {
        logger.warn("Koneksi WhatsApp sudah ada. Tidak membuat koneksi baru.");
        return;
    }

    sock = makeWASocket({
        printQRInTerminal: !global.useCode, // QR code jika useCode false
        logger: logger, // Gunakan logger yang di-import
        auth: state, // Gunakan state
        browser: Browsers.ubuntu("Chrome"),

    });

    store?.bind(sock.ev);

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin, qr } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.error('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp(); // Panggil rekursif jika perlu reconnect
            }
        } else if (connection === 'open') {
            logger.info('opened connection');

            // Pairing code (JIKA useCode TRUE)
            if (global.useCode && !isNewLogin) { //Hanya jika useCode true dan BUKAN login baru
                try {
                    const code = await sock.requestPairingCode(global.botNumber);
                    console.log(`Pairing Code: ${code}`);   // Tampilkan di console (PENTING)
                    logger.info(`[PAIRING] Pairing Code: ${code}`);
                } catch (error) {
                    logger.error("[PAIRING] Error requesting pairing code:", error);
                }
            }
        }

          if (qr && !global.useCode){
            console.log("Scan QR Code ini untuk login:")
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
       if (!m.messages) return;
        const msg = m.messages[0];
        if (!msg) return;

        const fromMe = msg.key.fromMe;
        const type = msg.type;
        const message = msg.message;
        const contentType = message ? Object.keys(message)[0] : null;

        if (global.setting.selfmode && !fromMe) {
            return;
        }

        const normalizedMsg =  {
            key: msg.key,
            message: msg.message,
            pushName: msg.pushName,
            type: contentType,
             get args() {

                const text =  (this.type === 'conversation') ?  this.message.conversation :
                              (this.type === 'extendedTextMessage') ? this.message.extendedTextMessage.text :
                              (this.type == 'imageMessage') && this.message.imageMessage.caption ? this.message.imageMessage.caption :
                              (this.type == 'videoMessage') && this.message.videoMessage.caption ? this.message.videoMessage.caption :
                              '';
               return text.split(' ').slice(1);
            },
             get quoted(){
                return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ?
                       {
                        stanzaId : msg.message.extendedTextMessage.contextInfo.stanzaId,
                        participant : msg.message.extendedTextMessage.contextInfo.participant,
                        message: msg.message.extendedTextMessage.contextInfo.quotedMessage,
                         get type(){
                           return  this.message ? Object.keys(this.message)[0] : null;
                        },
                        get fromMe(){
                            return  this.participant === global.botNumber.split(":")[0] + "@s.whatsapp.net";
                        }
                       } : null
            },

            isQuoted: !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage,
            isGroup: msg.key.remoteJid.endsWith('@g.us'),
            from: msg.key.remoteJid,

        }

         let text = (normalizedMsg.type === 'conversation') ? normalizedMsg.message.conversation
            : (normalizedMsg.type === 'extendedTextMessage') ? normalizedMsg.message.extendedTextMessage.text
                : (normalizedMsg.type == 'imageMessage') && normalizedMsg.message.imageMessage.caption ? normalizedMsg.message.imageMessage.caption
                    : (normalizedMsg.type == 'videoMessage') && normalizedMsg.message.videoMessage.caption ? normalizedMsg.message.videoMessage.caption
                        : '';

        const isCmd = text.startsWith(global.prefixCommand);
        const command = isCmd ? text.slice(global.prefixCommand.length).trim().split(/ +/)[0].toLowerCase() : '';

        logger.info(`[COMMAND] ${command} dari ${msg.pushName} (${msg.key.remoteJid})`);
        console.log({
            text: text,
            isCmd: isCmd,
            cmd: command,
            args: normalizedMsg.args,
            isLink : normalizedMsg.args ? normalizedMsg.args.filter(arg => arg.startsWith('http://') || arg.startsWith('https://')) : []
        })

        const cmd = commands.get(command);

        if (isCmd && cmd) {
            try {
                await cmd.handle(sock, normalizedMsg, logger);
            } catch (error) {
                logger.error(`Error handling command ${command}:`, error);
                await sock.sendMessage(msg.key.remoteJid, { text: global.mess.error.general }, { quoted: msg });
            }
        } else if (isCmd) {
          await sock.sendMessage(
                normalizedMsg.from,
                { text: global.mess.error.commandNotFound },
                { quoted: msg }
            );
        }
    });
      //Simpan store jika ada perubahan
     setInterval(() => {
        store?.writeToFile('./baileys_store_multi.json')
    }, 10000)
}


connectToWhatsApp()
    .catch(err => {
        logger.error("Error di connectToWhatsApp:", err);
        process.exit(1); // EXIT jika gagal
    });


// Handle Ctrl+C
process.on('SIGINT', async () => {
    logger.info('Menerima sinyal SIGINT. Mematikan bot...');
    if (sock) {
        try {
            await sock.sendMessage(sock.user.id, { text: 'Bot dimatikan.' });
             sock.end(undefined);
        } catch (error) {
            logger.error('Error saat mengirim pesan perpisahan/logout:', error);
        }

    }
    store?.writeToFile('./baileys_store_multi.json') //simpan store
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


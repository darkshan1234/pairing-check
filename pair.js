require('./send.js')
require('@adiwajshing/keyed-db')
const {
    default: sockConnect,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    jidNormalizedUser
} = require('@adiwajshing/baileys')
const {
    upload
} = require('./mega')
var fs = require('fs')
const pino = require('pino')
var auth_path = './auth_info_baileys/'
async function start() {
    var {
        version
    } = await fetchLatestBaileysVersion()

    try {
const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  const sock = sockConnect({
    printQRInTerminal: true,
    version: [2,2323,4],
    browser: ['Zero-Two-MD', 'Web', 'v2'],
    auth: state,
    version
  });
        sock.ev.on('creds.update', saveCreds)

        sock.ev.on('connection.update', async (update) => {
            const {
                connection
            } = update
            if (connection === 'close') {
                start()
            }
            if (update.qr) {
                qr_codde = update.qr
                         const QRLogo = require('qr-with-logo');
 const data = JSON.stringify(qr_codde)
 await QRLogo.generateQRWithLogo(data.replace(/"/g,''), "zen.png", {}, "Base64", "qrlogo.png", async function(b64) {
             qr_code = b64
   //console.log(b64)
 });
            }

            if (connection === 'open') {
                qr_code = ''
                const user_jid = jidNormalizedUser(sock.user.id);
                const mega_url = await upload(fs.createReadStream(auth_path + 'creds.json'), `${user_jid}.json`);
                const string_session = 'IZUMI=' + mega_url.replace('https://mega.nz/file/', '')
                await sock.sendMessage(user_jid, {
                    text: string_session
                });
                
                fs.rmSync(auth_path, {
                    recursive: true,
                    force: true
                })
                start()
            }
        })
    } catch {
        start()
    }
}

start()

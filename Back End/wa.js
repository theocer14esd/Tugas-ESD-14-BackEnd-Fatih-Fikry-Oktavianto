const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

const initWa = async () => {
    console.log('Inisialisasi WhatsApp');
    client.on('qr', (qr) => {
        console.log('QR Code diterima, silakan scan dengan aplikasi WhatsApp Anda:');
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', (session) => {
        console.log('Authentikasi WhatsApp berhasil:', session);
    });

    client.on('ready', () => {
        console.log('WhatsApp siap digunakan!');
    });

    client.on('message', async msg => {
        try {
            if (msg.body === '!menu') {
                await msg.reply('Berikut adalah menu yang tersedia:\n- Nasi Goreng\n- Mie Ayam\n- Soto Ayam\n- Bakso');
            } else if (msg.body === '!promo') {
                await msg.reply('Saat ini kami memiliki promo spesial untuk Anda! Dapatkan diskon 20% untuk semua produk dengan menggunakan kode promo: PROMO20. Jangan lewatkan kesempatan ini!');
            } else if (msg.body.toLowerCase() === 'apa kabar?') {
                await msg.reply('Alhamdulillah, saya baik. Bagaimana dengan Anda? Apakah ada yang bisa saya bantu?');
            } else if (msg.body === 'terima kasih') {
                await msg.reply('Terima kasih telah menghubungi kami! Jika Anda memiliki pertanyaan lebih lanjut atau membutuhkan bantuan, jangan ragu untuk menghubungi kami lagi.');
            } else if (msg.body === '!bantuan') {
                await msg.reply('Tentu, berikut beberapa opsi yang bisa saya bantu:\n- `!menu`: Menampilkan menu kami.\n- `!promo`: Menampilkan promo spesial kami.\n- `Apa kabar?`: Memulai percakapan.\n- `Terima kasih`: Mengakhiri percakapan.\n- Dan masih banyak lagi! Jangan ragu untuk bertanya jika Anda membutuhkan bantuan lebih lanjut.');
            } else {
                await msg.reply('Maaf, saya hanya bisa merespon pesan yang berisi !menu, !promo, Apa kabar?, terima kasih, atau !bantuan.');
            }
        } catch (error) {
            console.error('Terjadi kesalahan dalam memproses pesan:', error);
        }
    });

    await client.initialize();
}

initWa();

module.exports = { client, initWa };

// const cron = require('node-cron');
// const { Op } = require('sequelize');
// const { Transaksi } = require("../models");

// exports.startTransactionExpirationScheduler = () => {
//     // Scheduler untuk memperbarui status transaksi yang kadaluarsa setiap menit
//     cron.schedule('* * * * *', async () => {
//         try {
//             // Temukan transaksi yang masih "pending" dan telah melewati 15 menit
//             const expiredTransactions = await Transaksi.findAll({
//                 where: {
//                     status: 'pending',
//                     createdAt: { [Op.lt]: new Date(new Date() - 15 * 60000) } // 15 menit sebelum waktu saat ini
//                 }
//             });

//             // Ubah status transaksi menjadi 'kadaluarsa'
//             await Promise.all(expiredTransactions.map(async (transaction) => {
//                 await transaction.update({ status: 'kadaluarsa' });
//             }));

//             console.log('Status transaksi yang kadaluarsa berhasil diperbarui.');
//         } catch (error) {
//             console.error('Terjadi kesalahan saat memperbarui status transaksi yang kadaluarsa:', error);
//         }
//     });
// };

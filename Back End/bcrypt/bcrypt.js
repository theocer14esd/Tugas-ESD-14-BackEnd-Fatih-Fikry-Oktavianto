const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(12); // Menggunakan cost 12
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
}

module.exports = { hashPassword };

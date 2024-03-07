const bcrypt = require('bcrypt');
const { Pembeli } = require('../models');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

exports.authServiceLogin = async (req) => {
    const { email, password } = req.body;

    try {
        const dataUser = await Pembeli.findOne({
            where: { email }
        });

        if (!dataUser) {
            return { status: 403, message: "Email & password salah" };
        }

        const passwordIsValid = await bcrypt.compare(password, dataUser.password);

        if (!passwordIsValid) {
            return { status: 403, message: "Email & password salah" };
        }

        const token = jsonwebtoken.sign({
            id: dataUser.id,
            email: dataUser.email,
            nama: dataUser.nama,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return { 
            status: 201, 
            message: "Login berhasil", 
            data: { token }
        };
    } catch (err) {
        return { status: 500, message: err.message }; 
    }
};

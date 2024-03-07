const authService = require('../services/authService')

exports.authControllerLogin = async (req, res, next) => {
    try {
        const result = await authService.authServiceLogin(req);
        if (result.data) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ message: result.message });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
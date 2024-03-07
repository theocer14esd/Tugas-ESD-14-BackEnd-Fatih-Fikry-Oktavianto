const jsonwebtoken = require("jsonwebtoken");


exports.auth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET); // Pastikan anda menggunakan nama environment variable yang sesuai
      req.user_data = decoded;
      // Menambahkan id pengguna dari token ke dalam objek request
      req.userId = decoded.id; // Asumsi payload token memiliki properti 'id'
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized 1",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized 2",
    });
  }
};

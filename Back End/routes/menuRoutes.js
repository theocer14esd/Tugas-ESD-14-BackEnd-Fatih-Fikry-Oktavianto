const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const path = require("path");

// Middleware untuk menangani permintaan gambar
router.use("/gambar", express.static(path.join(__dirname, "../public/gambar")));

// Rute-rute untuk manajemen menu
router.post("/", menuController.addMenu);
router.get("/", menuController.getAllMenus);
router.get("/search", menuController.searchMenuByName);
router.get("/gambar/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, "../public/gambar", filename));
});
router.get("/:id", menuController.getMenuById);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);
router.post('/reset-id', menuController.resetMenuId);

module.exports = router;

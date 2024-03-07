const PembeliService = require('../services/pembeliService');
const { validateAddPembeli, validateEditPembeli } = require('../validations/pembeliValidation');

class PembeliController {
  static async addPembeli(req, res) {
    const { error } = validateAddPembeli(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try {
      const { nama, email, password, noTelp } = req.body;
      const pembeli = await PembeliService.addPembeli({ nama, email, password, noTelp });
      res.status(201).json(pembeli);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // static async addPembeli(req, res) {
  //   const { error } = validateAddPembeli(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);
  
  //   try {
  //     const { nama, email, password, noTelp } = req.body;
  //     const pembeli = await PembeliService.addPembeli({ nama, email, password, noTelp });
  //     res.status(201).json(pembeli);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }

  static async getAllPembeli(req, res) {
    try {
      const pembelis = await PembeliService.getAllPembeli();
      res.status(200).json(pembelis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPembeliById(req, res) {
    try {
      const { id } = req.params;
      const pembeli = await PembeliService.getPembeliById(id);
      if (pembeli) {
        res.status(200).json(pembeli);
      } else {
        res.status(404).json({ message: "Pembeli not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async searchPembeliByName(req, res) {
    try {
      const { name } = req.query;
      const pembelis = await PembeliService.searchPembeliByName(name);
      res.status(200).json(pembelis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }  

  static async updatePembeli(req, res) {
    const { error } = validateEditPembeli(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    try {
      const { id } = req.params;
      const { nama, email, password, noTelp } = req.body;
      const updatedPembeli = await PembeliService.updatePembeli(id, { nama, email, password, noTelp });
      res.status(200).json(updatedPembeli);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deletePembeli(req, res) {
    try {
      const { id } = req.params;
      await PembeliService.deletePembeli(id);
      res.status(200).json({ message: 'Pembeli successfully deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = PembeliController;

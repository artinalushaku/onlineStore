import Discount from '../models/mysql/discount.model.js';
import { Op } from 'sequelize';

// Kontrolluesi i kodeve te zbritjes
const discountController = {
  // Krijimi i nje kodi te ri zbritjeje (vetem admin)
  createDiscount: async (req, res) => {
    try {
      const { code, type, value, validFrom, validUntil, minimumPurchase, usageLimit, maxDiscount, description } = req.body;
      
      // Verifikojme nese kodi ekziston tashme
      const existingDiscount = await Discount.findOne({ where: { code } });
      if (existingDiscount) {
        return res.status(400).json({ message: 'Kodi i zbritjes ekziston tashme' });
      }
      
      // Krijojme kodin e ri te zbritjes
      const discount = await Discount.create({
        code,
        type,
        value,
        validFrom,
        validUntil,
        minimumPurchase: minimumPurchase || 0,
        usageLimit: usageLimit || null,
        maxDiscount: maxDiscount || null,
        description
      });
      
      return res.status(201).json(discount);
    } catch (error) {
      console.error('Gabim gjate krijimit te kodit te zbritjes:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te kodit te zbritjes' });
    }
  },
  
  // Marrja e te gjitha kodeve te zbritjes (vetem admin)
  getAllDiscounts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const { count, rows: discounts } = await Discount.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      return res.status(200).json({
        discounts,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Gabim gjate marrjes se kodeve te zbritjes:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se kodeve te zbritjes' });
    }
  },
  
  // Marrja e nje kodi zbritjeje te vetem (vetem admin)
  getDiscountById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const discount = await Discount.findByPk(id);
      
      if (!discount) {
        return res.status(404).json({ message: 'Kodi i zbritjes nuk u gjet' });
      }
      
      return res.status(200).json(discount);
    } catch (error) {
      console.error('Gabim gjate marrjes se kodit te zbritjes:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se kodit te zbritjes' });
    }
  },
  
  // Validimi i nje kodi zbritjeje (per perdoruesit)
  validateDiscount: async (req, res) => {
    try {
      const { code, cartTotal } = req.body;
      
      // Gjejme kodin e zbritjes
      const discount = await Discount.findOne({
        where: {
          code,
          isActive: true,
          validFrom: { [Op.lte]: new Date() },
          validUntil: { [Op.gte]: new Date() },
          [Op.or]: [
            { usageLimit: null },
            { usageCount: { [Op.lt]: sequelize.col('usage_limit') } }
          ]
        }
      });
      
      if (!discount) {
        return res.status(404).json({ message: 'Kodi i zbritjes nuk eshte i vlefshem ose ka skaduar' });
      }
      
      // Kontrollojme nese plotesohet vlera minimale e blerjes
      if (cartTotal < discount.minimumPurchase) {
        return res.status(400).json({
          message: `Kodi i zbritjes kerkon nje blerje minimale prej ${discount.minimumPurchase}`,
          minimumPurchase: discount.minimumPurchase
        });
      }
      
      // Llogarisim shumen e zbritur
      let discountAmount = 0;
      
      if (discount.type === 'percentage') {
        discountAmount = (cartTotal * discount.value) / 100;
        if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
          discountAmount = discount.maxDiscount;
        }
      } else if (discount.type === 'fixed') {
        discountAmount = discount.value;
        if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
          discountAmount = discount.maxDiscount;
        }
      }
      
      return res.status(200).json({
        valid: true,
        discountAmount,
        discount
      });
    } catch (error) {
      console.error('Gabim gjate validimit te kodit te zbritjes:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate validimit te kodit te zbritjes' });
    }
  },
  
  // Perditesimi i nje kodi zbritjeje (vetem admin)
  updateDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      const { code, type, value, validFrom, validUntil, minimumPurchase, usageLimit, isActive, maxDiscount, description } = req.body;
      
      const discount = await Discount.findByPk(id);
      
      if (!discount) {
        return res.status(404).json({ message: 'Kodi i zbritjes nuk u gjet' });
      }
      
      // Nese ndryshojme kodin, verifikojme nese ekziston tashme
      if (code && code !== discount.code) {
        const existingDiscount = await Discount.findOne({ where: { code } });
        if (existingDiscount) {
          return res.status(400).json({ message: 'Kodi i zbritjes ekziston tashme' });
        }
      }
      
      // Perditesojme kodin e zbritjes
      await discount.update({
        code: code || discount.code,
        type: type || discount.type,
        value: value !== undefined ? value : discount.value,
        validFrom: validFrom || discount.validFrom,
        validUntil: validUntil || discount.validUntil,
        minimumPurchase: minimumPurchase !== undefined ? minimumPurchase : discount.minimumPurchase,
        usageLimit: usageLimit !== undefined ? usageLimit : discount.usageLimit,
        maxDiscount: maxDiscount !== undefined ? maxDiscount : discount.maxDiscount,
        isActive: isActive !== undefined ? isActive : discount.isActive,
        description: description !== undefined ? description : discount.description
      });
      
      return res.status(200).json(discount);
    } catch (error) {
      console.error('Gabim gjate perditesimit te kodit te zbritjes:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te kodit te zbritjes' });
    }
  },
  
  // Fshirja e nje kodi zbritjeje (vetem admin)
  deleteDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      
      const discount = await Discount.findByPk(id);
      
      if (!discount) {
        return res.status(404).json({ message: 'Kodi i zbritjes nuk u gjet' });
      }
      
      // Fshirja logjike (ndryshojme isActive ne false)
      await discount.update({ isActive: false });
      
      return res.status(200).json({ message: 'Kodi i zbritjes u çaktivizua me sukses' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se kodit te zbritjes:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se kodit te zbritjes' });
    }
  }
};

export default discountController;
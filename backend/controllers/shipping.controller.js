import Shipping from '../models/mysql/shipping.model.js';
import { Op } from 'sequelize';

// Kontrolluesi i metodave te dergeses
const shippingController = {
  // Krijimi i nje metode te re dergese (vetem admin)
  createShipping: async (req, res) => {
    try {
      const { name, price, estimatedDelivery, description, countries, isDefault } = req.body;
      
      // Nese metoda e re eshte e parazgjedhur, çaktivizojme çdo metode tjeter te parazgjedhur
      if (isDefault) {
        await Shipping.update({ isDefault: false }, { where: { isDefault: true } });
      }
      
      // Krijojme metoden e re te dergeses
      const shipping = await Shipping.create({
        name,
        price,
        estimatedDelivery,
        description,
        countries: countries || [],
        isDefault: isDefault || false
      });
      
      return res.status(201).json(shipping);
    } catch (error) {
      console.error('Gabim gjate krijimit te metodes se dergeses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te metodes se dergeses' });
    }
  },
  
  // Marrja e te gjitha metodave te dergeses
  getAllShipping: async (req, res) => {
    try {
      // Opsioni per te filtruar vetem metodat aktive
      const where = {};
      if (req.query.activeOnly === 'true') {
        where.isActive = true;
      }
      
      // Always return all shipping methods, no country filtering
      const shippingMethods = await Shipping.findAll({
        where,
        order: [['price', 'ASC']]
      });
      
      return res.status(200).json(shippingMethods);
    } catch (error) {
      console.error('Gabim gjate marrjes se metodave te dergeses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se metodave te dergeses' });
    }
  },
  
  // Marrja e nje metode dergese te vetme
  getShippingById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const shipping = await Shipping.findByPk(id);
      
      if (!shipping) {
        return res.status(404).json({ message: 'Metoda e dergeses nuk u gjet' });
      }
      
      return res.status(200).json(shipping);
    } catch (error) {
      console.error('Gabim gjate marrjes se metodes se dergeses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se metodes se dergeses' });
    }
  },
  
  // Perditesimi i nje metode dergese (vetem admin)
  updateShipping: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, estimatedDelivery, description, countries, isActive, isDefault } = req.body;
      
      const shipping = await Shipping.findByPk(id);
      
      if (!shipping) {
        return res.status(404).json({ message: 'Metoda e dergeses nuk u gjet' });
      }
      
      // Nese perditesojme metoden si te parazgjedhur, çaktivizojme çdo metode tjeter te parazgjedhur
      if (isDefault && !shipping.isDefault) {
        await Shipping.update({ isDefault: false }, { where: { isDefault: true } });
      }
      
      // Perditesojme metoden e dergeses
      await shipping.update({
        name: name || shipping.name,
        price: price !== undefined ? price : shipping.price,
        estimatedDelivery: estimatedDelivery || shipping.estimatedDelivery,
        description: description !== undefined ? description : shipping.description,
        countries: countries || shipping.countries,
        isActive: isActive !== undefined ? isActive : shipping.isActive,
        isDefault: isDefault !== undefined ? isDefault : shipping.isDefault
      });
      
      return res.status(200).json(shipping);
    } catch (error) {
      console.error('Gabim gjate perditesimit te metodes se dergeses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te metodes se dergeses' });
    }
  },
  
  // Fshirja e nje metode dergese (vetem admin)
  deleteShipping: async (req, res) => {
    try {
      const { id } = req.params;
      const shipping = await Shipping.findByPk(id);
      if (!shipping) {
        return res.status(404).json({ message: 'Metoda e dergeses nuk u gjet' });
      }
      if (shipping.isDefault) {
        return res.status(400).json({ message: 'Nuk mund te fshihet metoda e parazgjedhur e dergeses. Caktoni nje metode tjeter si te parazgjedhur perpara se te fshini kete metode.' });
      }
      // Hard delete: remove from database
      await shipping.destroy();
      return res.status(200).json({ message: 'Metoda e dergeses u fshi përfundimisht' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se metodes se dergeses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se metodes se dergeses' });
    }
  },

  // Get all shipping methods
  getAllShippingMethods: async (req, res) => {
    try {
      const shippingMethods = await Shipping.findAll();
      res.json(shippingMethods);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      res.status(500).json({ message: 'Error fetching shipping methods' });
    }
  },

  // Get shipping methods for a specific country
  getShippingMethodsByCountry: async (req, res) => {
    try {
      const { country } = req.params;
      const shippingMethods = await Shipping.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { countries: { [Op.contains]: [country] } },
            { countries: { [Op.eq]: [] } } // Methods available in all countries
          ]
        }
      });
      res.json(shippingMethods);
    } catch (error) {
      console.error('Error fetching shipping methods for country:', error);
      res.status(500).json({ message: 'Error fetching shipping methods' });
    }
  },

  // Create a new shipping method
  createShippingMethod: async (req, res) => {
    try {
      const { name, price, estimatedDelivery, description, isActive, isDefault, countries } = req.body;

      // If this is set as default, unset any existing default
      if (isDefault) {
        await Shipping.update(
          { isDefault: false },
          { where: { isDefault: true } }
        );
      }

      const shippingMethod = await Shipping.create({
        name,
        price,
        estimatedDelivery,
        description,
        isActive,
        isDefault,
        countries: countries || []
      });

      res.status(201).json(shippingMethod);
    } catch (error) {
      console.error('Error creating shipping method:', error);
      res.status(500).json({ message: 'Error creating shipping method' });
    }
  },

  // Update a shipping method
  updateShippingMethod: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, estimatedDelivery, description, isActive, isDefault, countries } = req.body;

      // If this is set as default, unset any existing default
      if (isDefault) {
        await Shipping.update(
          { isDefault: false },
          { where: { isDefault: true, id: { [Op.ne]: id } } }
        );
      }

      const shippingMethod = await Shipping.findByPk(id);
      if (!shippingMethod) {
        return res.status(404).json({ message: 'Shipping method not found' });
      }

      await shippingMethod.update({
        name,
        price,
        estimatedDelivery,
        description,
        isActive,
        isDefault,
        countries: countries || []
      });

      res.json(shippingMethod);
    } catch (error) {
      console.error('Error updating shipping method:', error);
      res.status(500).json({ message: 'Error updating shipping method' });
    }
  },

  // Delete a shipping method
  deleteShippingMethod: async (req, res) => {
    try {
      const { id } = req.params;
      const shippingMethod = await Shipping.findByPk(id);
      
      if (!shippingMethod) {
        return res.status(404).json({ message: 'Shipping method not found' });
      }

      await shippingMethod.destroy();
      res.json({ message: 'Shipping method deleted successfully' });
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      res.status(500).json({ message: 'Error deleting shipping method' });
    }
  }
};

export default shippingController;
const Address = require('../models/mysql/address.model');
const { Op } = require('sequelize');
const sequelize = require('../config/db.mysql');

// Kontrolluesi i adresave
const addressController = {
  // Marrja e te gjitha adresave te perdoruesit
  getUserAddresses: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const addresses = await Address.findAll({
        where: { userId },
        order: [
          ['isDefault', 'DESC'], // Adresat e parazgjedhura te parat
          ['createdAt', 'DESC']  // Pastaj sipas dates se krijimit (me te rejat te parat)
        ]
      });
      
      return res.status(200).json(addresses);
    } catch (error) {
      console.error('Gabim gjate marrjes se adresave:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se adresave' });
    }
  },
  
  // Marrja e nje adrese te vetme
  getAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const address = await Address.findOne({
        where: { id, userId }
      });
      
      if (!address) {
        return res.status(404).json({ message: 'Adresa nuk u gjet' });
      }
      
      return res.status(200).json(address);
    } catch (error) {
      console.error('Gabim gjate marrjes se adreses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se adreses' });
    }
  },
  
  // Krijimi i nje adrese te re
  createAddress: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const userId = req.user.id;
      const { 
        firstName, lastName, address1, address2, city, 
        state, country, postalCode, phone, isDefault, addressType 
      } = req.body;
      
      // Kontrollo nese duhet te bejme kete adrese si te parazgjedhur
      if (isDefault) {
        // Cdeaktivizo cdo adrese tjeter te parazgjedhur te ketij tipi
        await Address.update(
          { isDefault: false },
          { 
            where: { 
              userId,
              addressType,
              isDefault: true
            },
            transaction 
          }
        );
      }
      
      // Krijo adresen e re
      const address = await Address.create({
        userId,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
        addressType: addressType || 'shipping'
      }, { transaction });
      
      await transaction.commit();
      
      return res.status(201).json(address);
    } catch (error) {
      await transaction.rollback();
      console.error('Gabim gjate krijimit te adreses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te adreses' });
    }
  },
  
  // Perditesimi i nje adrese
  updateAddress: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { 
        firstName, lastName, address1, address2, city, 
        state, country, postalCode, phone, isDefault, addressType 
      } = req.body;
      
      // Gjej adresen qe do te perditesojme
      const address = await Address.findOne({
        where: { id, userId }
      });
      
      if (!address) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Adresa nuk u gjet' });
      }
      
      // Kontrollo nese duhet te bejme kete adrese si te parazgjedhur
      if (isDefault && !address.isDefault) {
        // Cdeaktivizo cdo adrese tjeter te parazgjedhur te ketij tipi
        await Address.update(
          { isDefault: false },
          { 
            where: { 
              userId,
              addressType: addressType || address.addressType,
              isDefault: true,
              id: { [Op.ne]: id }
            },
            transaction 
          }
        );
      }
      
      // Perditeso adresen
      await address.update({
        firstName: firstName || address.firstName,
        lastName: lastName || address.lastName,
        address1: address1 || address.address1,
        address2: address2 !== undefined ? address2 : address.address2,
        city: city || address.city,
        state: state !== undefined ? state : address.state,
        country: country || address.country,
        postalCode: postalCode || address.postalCode,
        phone: phone || address.phone,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault,
        addressType: addressType || address.addressType
      }, { transaction });
      
      await transaction.commit();
      
      return res.status(200).json(address);
    } catch (error) {
      await transaction.rollback();
      console.error('Gabim gjate perditesimit te adreses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te adreses' });
    }
  },
  
  // Fshirja e nje adrese
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const address = await Address.findOne({
        where: { id, userId }
      });
      
      if (!address) {
        return res.status(404).json({ message: 'Adresa nuk u gjet' });
      }
      
      await address.destroy();
      
      return res.status(200).json({ message: 'Adresa u fshi me sukses' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se adreses:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se adreses' });
    }
  },
  
  // Caktimi i nje adrese si te parazgjedhur
  setDefaultAddress: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Gjej adresen qe do te bejme si te parazgjedhur
      const address = await Address.findOne({
        where: { id, userId }
      });
      
      if (!address) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Adresa nuk u gjet' });
      }
      
      // Cdeaktivizo cdo adrese tjeter te parazgjedhur te ketij tipi
      await Address.update(
        { isDefault: false },
        { 
          where: { 
            userId,
            addressType: address.addressType,
            isDefault: true,
            id: { [Op.ne]: id }
          },
          transaction 
        }
      );
      
      // Bej kete adrese si te parazgjedhur
      await address.update({ isDefault: true }, { transaction });
      
      await transaction.commit();
      
      return res.status(200).json({ message: 'Adresa u be e parazgjedhur me sukses', address });
    } catch (error) {
      await transaction.rollback();
      console.error('Gabim gjate caktimit te adreses si te parazgjedhur:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate caktimit te adreses si te parazgjedhur' });
    }
  }
};

module.exports = addressController;
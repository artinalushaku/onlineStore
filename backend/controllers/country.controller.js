import Country from '../models/mysql/country.model.js';

const countryController = {
  getAll: async (req, res) => {
    try {
      const countries = await Country.findAll({ order: [['name', 'ASC']] });
      res.json(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ message: 'Error fetching countries' });
    }
  },

  add: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Country name required' });
      const country = await Country.create({ name });
      res.status(201).json(country);
    } catch (error) {
      console.error('Error adding country:', error);
      res.status(500).json({ message: 'Error adding country' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Country.destroy({ where: { id } });
      res.json({ message: 'Country deleted' });
    } catch (error) {
      console.error('Error deleting country:', error);
      res.status(500).json({ message: 'Error deleting country' });
    }
  }
};

export default countryController;
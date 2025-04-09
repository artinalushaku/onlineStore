import Category from '../models/mysql/category.model.js';
import slugify from 'slugify';
import { Op } from 'sequelize';

// Kontrolluesi i kategorive
const categoryController = {
  // Krijimi i nje kategorie te re
  createCategory: async (req, res) => {
    try {
      const { name, description, parent_id, isActive } = req.body;
      
      // Gjenerimi i slug nga emri
      const slug = slugify(name, { lower: true });
      
      // Kontrollo nese kategoria ekziston tashme
      const existingCategory = await Category.findOne({ 
        where: { 
          [Op.or]: [
            { name },
            { slug }
          ] 
        } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Kategoria me kete emer ekziston tashme' });
      }
      
      // Krijimi i kategorise
      const category = await Category.create({
        name,
        slug,
        description,
        parent_id: parent_id || null,
        image: req.file ? req.file.path : null,
        isActive: isActive !== undefined ? isActive : true
      });
      
      return res.status(201).json(category);
    } catch (error) {
      console.error('Gabim gjate krijimit te kategorise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate krijimit te kategorise' });
    }
  },
  
  // Marrja e te gjitha kategorive
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Category,
            as: 'subcategories',
            attributes: ['id', 'name', 'slug']
          }
        ],
        where: {
          parent_id: null // Vetem kategorite kryesore
        },
        order: [['name', 'ASC']]
      });
      
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Gabim gjate marrjes se kategorive:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se kategorive' });
    }
  },
  
  // Marrja e te gjitha kategorive ne forme te sheshte
  getAllCategoriesFlat: async (req, res) => {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name', 'slug', 'parent_id', 'isActive'],
        order: [['name', 'ASC']]
      });
      
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Gabim gjate marrjes se kategorive:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se kategorive' });
    }
  },
  
  // Marrja e nje kategorie te vetme
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'subcategories',
            attributes: ['id', 'name', 'slug']
          },
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'name', 'slug']
          }
        ]
      });
      
      if (!category) {
        return res.status(404).json({ message: 'Kategoria nuk u gjet' });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error('Gabim gjate marrjes se kategorise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se kategorise' });
    }
  },
  
  // Perditesimi i nje kategorie
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, parent_id, isActive } = req.body;
      
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Kategoria nuk u gjet' });
      }
      
      let updateData = {
        description: description !== undefined ? description : category.description,
        parent_id: parent_id !== undefined ? parent_id : category.parent_id,
        isActive: isActive !== undefined ? isActive : category.isActive
      };
      
      // Nese emri ndryshon, perditeso edhe slug-un
      if (name && name !== category.name) {
        const slug = slugify(name, { lower: true });
        
        // Kontrollo nese ekziston nje kategori tjeter me kete emer/slug
        const existingCategory = await Category.findOne({ 
          where: { 
            [Op.and]: [
              { id: { [Op.ne]: id } }, // id jo e barabarte me id aktuale
              { 
                [Op.or]: [
                  { name },
                  { slug }
                ] 
              }
            ]
          } 
        });
        
        if (existingCategory) {
          return res.status(400).json({ message: 'Kategoria me kete emer ekziston tashme' });
        }
        
        updateData.name = name;
        updateData.slug = slug;
      }
      
      // Nese ka imazh te ri
      if (req.file) {
        updateData.image = req.file.path;
      }
      
      await category.update(updateData);
      
      return res.status(200).json(category);
    } catch (error) {
      console.error('Gabim gjate perditesimit te kategorise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te kategorise' });
    }
  },
  
  // Fshirja e nje kategorie
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Kategoria nuk u gjet' });
      }
      
      // Kontrollo nese ka nenkategori
      const subcategories = await Category.findAll({ where: { parent_id: id } });
      
      if (subcategories.length > 0) {
        return res.status(400).json({ 
          message: 'Kjo kategori ka nenkategori. Ju duhet t\'i fshini ose zhvendosni ato se pari.' 
        });
      }
      
      // Kontrollo nese ka produkte
      const products = await category.getProducts();
      
      if (products.length > 0) {
        return res.status(400).json({ 
          message: 'Kjo kategori ka produkte. Ju duhet t\'i fshini ose zhvendosni ato se pari.' 
        });
      }
      
      await category.destroy();
      
      return res.status(200).json({ message: 'Kategoria u fshi me sukses' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se kategorise:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se kategorise' });
    }
  }
};

export default categoryController;
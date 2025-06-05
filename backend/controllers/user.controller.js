import User from '../models/mysql/user.model.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// Kontrolluesi i perdoruesve
const userController = {
  // Marrja e profilit te perdoruesit
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Gabim gjate marrjes se profilit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se profilit' });
    }
  },
  
  // Perditesimi i profilit te perdoruesit
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phone, address, city, country, postalCode } = req.body;
      
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }
      
      // Perditesojme perdoruesin
      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phone: phone !== undefined ? phone : user.phone,
        address: address !== undefined ? address : user.address,
        city: city !== undefined ? city : user.city,
        country: country !== undefined ? country : user.country,
        postalCode: postalCode !== undefined ? postalCode : user.postalCode
      });
      
      // Kthejme objektin e perditesuar (pa fjalekalimin)
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Gabim gjate perditesimit te profilit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te profilit' });
    }
  },
  
  // Ndryshimi i fjalekalimit
  changePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }
      
      // Verifikojme fjalekalimin aktual
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Fjalekalimi aktual eshte i pasakte' });
      }
      
      // Ndryshojme fjalekalimin
      await user.update({ password: newPassword });
      
      return res.status(200).json({ message: 'Fjalekalimi u ndryshua me sukses' });
    } catch (error) {
      console.error('Gabim gjate ndryshimit te fjalekalimit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate ndryshimit te fjalekalimit' });
    }
  },
  
  // Marrja e te gjithe perdoruesve (vetem admin)
  getAllUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Krijojme opsionet e filtrimit
      const whereClause = {};
      
      // Kerkim sipas emrit ose emailit
      if (req.query.search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${req.query.search}%` } },
          { lastName: { [Op.like]: `%${req.query.search}%` } },
          { email: { [Op.like]: `%${req.query.search}%` } }
        ];
      }
      
      // Filtrim sipas statusit aktiv
      if (req.query.isActive !== undefined) {
        whereClause.isActive = req.query.isActive === 'true';
      }
      
      // Filtrim sipas rolit
      if (req.query.role) {
        whereClause.role = req.query.role;
      }
      
      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      return res.status(200).json({
        users,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Gabim gjate marrjes se perdoruesve:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se perdoruesve' });
    }
  },
  
  // Marrja e nje perdoruesi te vetem (vetem admin)
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Gabim gjate marrjes se perdoruesit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate marrjes se perdoruesit' });
    }
  },
  
  // Perditesimi i nje perdoruesi (vetem admin)
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, role, isActive, phone, address, city, country, postalCode } = req.body;
      
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }
      
      // Nese ndryshojme emailin, verifikojme nese ekziston tashme
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Ky email eshte ne perdorim tashme' });
        }
      }
      
      // Perditesojme perdoruesin
      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        role: role || user.role,
        isActive: isActive !== undefined ? isActive : user.isActive,
        phone: phone !== undefined ? phone : user.phone,
        address: address !== undefined ? address : user.address,
        city: city !== undefined ? city : user.city,
        country: country !== undefined ? country : user.country,
        postalCode: postalCode !== undefined ? postalCode : user.postalCode
      });
      
      // Kthejme objektin e perditesuar (pa fjalekalimin)
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Gabim gjate perditesimit te perdoruesit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te perdoruesit' });
    }
  },
  
  // Rivendosja e fjalekalimit (vetem admin)
  resetUserPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }
      
      // Ndryshojme fjalekalimin
      await user.update({ password: newPassword });
      
      return res.status(200).json({ message: 'Fjalekalimi u rivendos me sukses' });
    } catch (error) {
      console.error('Gabim gjate rivendosjes se fjalekalimit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate rivendosjes se fjalekalimit' });
    }
  },

  // Perditesimi i rolit te perdoruesit (vetem admin)
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Roli i pavlefshem' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }

      await user.update({ role });
      return res.status(200).json({ message: 'Roli u perditesua me sukses' });
    } catch (error) {
      console.error('Gabim gjate perditesimit te rolit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te rolit' });
    }
  },

  // Perditesimi i statusit te perdoruesit (vetem admin)
  updateUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Statusi i pavlefshem' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }

      await user.update({ isActive });
      return res.status(200).json({ message: 'Statusi u perditesua me sukses' });
    } catch (error) {
      console.error('Gabim gjate perditesimit te statusit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate perditesimit te statusit' });
    }
  },

  // Fshirja e nje perdoruesi (vetem admin)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Perdoruesi nuk u gjet' });
      }

      // Nuk lejojme fshirjen e perdoruesit aktual
      if (id === req.user.id) {
        return res.status(400).json({ message: 'Nuk mund te fshish llogarine tende' });
      }

      await user.destroy();
      return res.status(200).json({ message: 'Perdoruesi u fshi me sukses' });
    } catch (error) {
      console.error('Gabim gjate fshirjes se perdoruesit:', error);
      return res.status(500).json({ message: 'Gabim ne server gjate fshirjes se perdoruesit' });
    }
  }
};

export default userController;
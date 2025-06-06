import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/mysql/user.model.js';

// Middleware per autentikimin
const authMiddleware = {
    // Mbrojtja e routes qe kerkojne autentikim
    protect: async (req, res, next) => {
        try {
            // Nxjerrja e token-it nga header-i
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                return res.status(401).json({ message: 'Ju nuk jeni i identifikuar. Ju lutem identifikohuni per te pasur akses' });
            }

            // Verifikimi i token-it
            const decoded = jwt.verify(token, JWT_SECRET);

            // Kontrolli nese perdoruesi ekziston ende
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Perdoruesi qe i perket ketij token-i nuk ekziston me' });
            }

            // Vendosim perdoruesin ne objekt-in req
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token i pavlefshem' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token-i juaj ka skaduar. Ju lutem identifikohuni perseri' });
            }
            console.error('Gabim ne middleware protect:', error);
            return res.status(500).json({ message: 'Gabim ne server' });
        }
    },

    // Kufizimi i aksesit bazuar ne role
    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Ju nuk keni te drejte te kryeni kete veprim' });
            }
            next();
        };
    }
};
export default authMiddleware;

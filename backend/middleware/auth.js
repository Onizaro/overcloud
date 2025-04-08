import jwt from 'jsonwebtoken';

const JWT_SECRET = "ici_il_faut_le_remplacer_par_une_variable_d'environnement";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Récupère le header Authorization
    const token = authHeader && authHeader.split(' ')[1]; // Extrait le token après "Bearer"
    

    if (token == null) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Erreur JWT:', err.message);
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = user; 
        next();
    });
};

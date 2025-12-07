// src/middlewares/role.middleware.js

// Define los IDs de los roles de gestión
const GESTION_ROLES = [1, 2, 3]; 
const CLIENTE_ROL = 4;

export const checkRole = (allowedRoles) => (req, res, next) => {
    // Ya asumimos que authMiddleware corre primero y adjunta req.user
    const { idRol } = req.user;

    if (!allowedRoles.includes(idRol)) {
        return res.status(403).json({ success: false, error: "Acceso denegado. Rol insuficiente para esta operación." });
    }
    next();
};

// Exportamos configuraciones comunes para mayor legibilidad en las rutas
export const isGestion = checkRole(GESTION_ROLES);
export const isGestionOrCliente = checkRole([...GESTION_ROLES, CLIENTE_ROL]);
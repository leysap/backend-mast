const jwt = require('jsonwebtoken');
const dayjs= require('dayjs')
const { getById } = require('../models/usuarios');

const checkToken = async (req, res, next) => {
    //Comprueba si existe el token 
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Debes incluir la cabecera de autorización'})
    }

    //valida el token 
    const token = req.headers['authorization'];
    let payload;
    try {
        payload = jwt.verify(token, 'CLAVE SECRETA');
    } catch (error) {
        return res.status(403).json({
            error: 'El token es incorrecto',
            msg: error.message
        })
    }
    //comprueba si el token no ha expirado
    if (payload.expiredAt < dayjs().unix()) {
        return res.status(403).json({ error: 'El token está caducado' });
    }
    //recupera al usuario y lo anade a la request 
    const usuario = await getById(payload.userId);
    req.user = usuario;
    //continua la ejecucion
    next();
}


// Middleware para verificar el rol de administrador
function verifyAdminRole(req, res, next) {
    if (req.user.role!== 'admin') {
      return res.status(403).send('Acceso denegado: Se requiere rol de administrador.');
    }
    next();
  }
module.exports = { log, checkToken, verifyAdminRole };
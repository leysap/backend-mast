const express = require('express');
const bcrypt= require('bcryptjs')
const router = express.Router();
const {body, validationResult}= require('express-validator')
const dayjs= require('dayjs')
const jwt= require('jsonwebtoken')
const { getAll, registro, getByEmail, getById , editUser, deleteUser} = require('../../models/usuarios');
const {checkToken, log} = require("../middlewares")

function createToken(user) {

    const payload = {
        userId: user.id,
        expiredAt: dayjs().add(1, 'hour').unix(),
        createdAt: dayjs().unix()
    }
    return jwt.sign(payload, 'CLAVE SECRETA');
}

// RUTA api/usuarios

//TRAE TODOS LOS USUARIOS REGISTRADOS
router.get('/',log, (req, res) => {
    getAll()
        .then(rows => res.json(rows))
        .catch(error => res.json({ error: error.message }));

});

//NUEVO USUARIO REGISTRO CON VALIDACIONES Y ENCRIPTACION DE PASSWORD  
router.post(
    '/', 
    body('name', 
        'El campo nombre es requerido y longitud mínima de 3 caracteres'
    ).exists().isLength({ min: 3 }),
    body(
        'email',
        'El email debe tener un formato correcto'
    ).isEmail(),
    async (req,res)=>{
        // Validación datos entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //Encriptar el password
        req.body.password= bcrypt.hashSync(req.body.password,10);
        const result = await registro(req.body);
        res.json(result);
    }
);

//POST /usuarios/login (Pública) : Identifica al usuario usando username/email y
//password. Devuelve un token JWT que sea válido durante 1 hora.
router.post('/login', async (req, res) => {
    //Recuperamos el usuario de la base de datos 
    const user = await getByEmail(req.body.email);
    if (user) {
        //COmprobamos la password de la base de datos con la que ha enviado el usuario en el body 
        const iguales = bcrypt.compareSync(req.body.password, user.password);
        if (iguales) {
            const token= createToken(user)
            res.json({ 
                success: 'Login correcto!',
                token: token
            });
        } else {
            // Si la password no coincide devolvemos error
            res.json({ error: 'Error la password es incorrecto' });
        }
    } else {
        // Si el usuario no existe en la BD devolvemos un error
        res.json({ error: 'Error no existe el usuario y/o password' });
    }

})

//GET DEVUELVE UN USUARIO CONCRETO CON EL ID
router.get('/:id', async(req, res) => {
    getById(req.params.id)
        .then(rows => res.json(rows))
        .catch(error => res.json({ error: error.message }));
});

//PUT ACTUALIZAMOS UN USUARIO, con el mismo id que uno se logueó
router.put('/:id',checkToken, async(req, res) => {
    const usuarioId = req.params.id;
    const { id } = req.user;
    const { name, email, role, username } = req.body;

    if (usuarioId != id) {
        return res.status(403).json({ error: 'No tienes permiso para actualizar este usuario' });
    }

    editUser(usuarioId, { name, email, role, username })
        .then(result => res.json({ message: 'Usuario actualizado correctamente', result }))
        .catch(error => res.status(500).json({ error: error.message }));

});

//ELIMINAMOS UN USUARIO, el mismo que se logueó
router.delete('/:id', checkToken, async(req, res) => {
    const usuarioId = req.params.id;
    console.log(usuarioId)
    const { id } = req.user;
    console.log("req.user" + req.user.id)

    if (usuarioId != id) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este usuario' });
    }

    deleteUser(usuarioId)
        .then(result => res.json({ message: 'Usuario eliminado correctamente', result }))
        .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = router;
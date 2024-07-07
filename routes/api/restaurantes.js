const express = require('express');

const router = express.Router();

const { getAll , registro, removeRestaurant, editRestaurant} = require('../../models/restaurantes');
const {checkToken, verifyAdminRole}= require('../middlewares')

// GET /restaurantes : Devuelve todos los restaurantes creados
router.get('/', (req, res) => {
    getAll()
        .then(rows => res.json(rows))
        .catch(error => res.json({ error: error.message }));
});

//POST /restaurantes/ (Privada) : Crea un registro de información para un
//restaurante. Únicamente usuarios registrados podrán crearlo.
router.post('/',checkToken, async(req, res) => {
    await registro(req.body)
    .then(rows => res.json(rows))
    .catch(error => res.json({ error: error.message }));
});

//PUT /restaurantes/:id; (Privada) : Actualiza la información del restaurante pero 
//únicamente el usuario que ha creado el registro podrá actualizarlo.
router.put('/:id',checkToken, async (req, res) => {
    const restaurantId= req.params.id
    console.log(restaurantId)
    const {name, address, phone} = req.body
    const userId= req.user.id

    db.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        const restaurant = results[0];

        if (restaurant.user_id !== userId) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este restaurante' });
        }
        
        editRestaurant(restaurantId, {name, address, phone})
            .then(result => res.json(result))
            .catch(error => res.json({ error: error.message }));
    });
});


//DELETE DELETE /restaurantes/:id (Protegida) : Eliminar un registro de restaurante. Solo
//usuarios con el rol “ADMIN” podrán eliminar un registro.
router.delete('/:id',checkToken, verifyAdminRole, (req, res) => {
    console.log(req.params.id)
    removeRestaurant(req.params.id)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));
   
});

module.exports = router;
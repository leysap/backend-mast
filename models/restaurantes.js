exports.getAll = () => {

    return new Promise((resolve, reject) => {

        db.query(

            'SELECT * FROM restaurants',

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        )

    });

}

exports.registro = ({ name, user_id, address, phone }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO restaurants ( name, user_id, address, phone) values (?, ?, ?, ?);',
            [ name, user_id, address, phone],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};


exports.removeRestaurant = (id) => {

    return new Promise((resolve, reject) => {
    
        db.query(
    
            'DELETE FROM restaurants WHERE id = ?',
            [id],
            (err, result) => {    
                if (err) return reject(err);
                resolve(result);
            })
        });
    
}


exports.editRestaurant = (id, { name, address, phone }) => {

    return new Promise((resolve, reject) => {

        db.query(

            'UPDATE restaurants SET name = ?, address = ?, phone = ? WHERE id = ?',
            [ name, address, phone, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }

        )

    });

}
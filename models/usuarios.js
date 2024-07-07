exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users',
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        )
    });
}

exports.registro = ({ name, email, password, role, username }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO users (name, email, password, role, username) values (?, ?, ?, ?, ?);',
            [ name, email, password, role, username],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};

exports.getByEmail = (email) => {

    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length !== 1) return resolve(null);
                resolve(rows[0]);
            }
        )

    });

}

exports.getById = (id) => {

    return new Promise((resolve, reject) => {

        db.query(
            'SELECT name,email,password,role,username,id FROM users WHERE id = ?',
            [id],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length !== 1) return resolve(null);
                resolve(rows[0]);
            }
        )
    });
}

exports.editUser = (id, { name, email, role, username}) => {

    return new Promise((resolve, reject) => {
        db.query(

            'UPDATE users SET name = ?, email = ?, role=? , username= ? WHERE id = ?',
            [ name, email, role, username, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
}

exports.deleteUser = (id) => {

    return new Promise((resolve, reject) => {
    
        db.query(
    
            'DELETE FROM users WHERE id = ?',
            [id],
            (err, result) => {    
                if (err) return reject(err);
                resolve(result);
            })
        });
}
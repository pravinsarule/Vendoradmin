const pool = require('../config/db');

class SuperAdminModel {
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM super_admins WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async create(name, email, hashedPassword) {
        const result = await pool.query(
            'INSERT INTO super_admins (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        return result.rows[0];
    }
}

module.exports = SuperAdminModel;

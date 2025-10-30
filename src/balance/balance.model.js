import pool from '../config/db.js';

export const getUserBalance = async (email) => {
    const result = await pool.query(
        'SELECT balance FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0] || null;
};

export const updateUserBalance = async (email, amount) => {
    const result = await pool.query(
        `UPDATE users 
        SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
        WHERE email = $2
        RETURNING balance`,
        [amount, email]
    );
    return result.rows[0];
};

export const insertBalanceHistory = async (email, type, amount, description) => {
    const userRes = await pool.query(
        'SELECT user_id FROM users WHERE email = $1',
        [email]
    );
    const userId = userRes.rows[0].user_id;

    await pool.query(
        `INSERT INTO balance_history (user_id, type, amount, description)
     VALUES ($1, $2, $3, $4)`,
        [userId, type, amount, description]
    );
};
import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

export const createUser = async (email, first_name, last_name, hashedPassword) => {
    await pool.query(
        `INSERT INTO users (email, first_name, last_name, password)
        VALUES ($1, $2, $3, $4)`,
        [email, first_name, last_name, hashedPassword]
    );
};

export const getProfileByEmail = async (email) => {
    const result = await pool.query(
        `SELECT email, first_name, last_name, profile_image
     FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
};

export const updateProfile = async (email, first_name, last_name) => {
    const result = await pool.query(
        `UPDATE users
     SET first_name = $1,
         last_name = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE email = $3
     RETURNING email, first_name, last_name, profile_image`,
        [first_name, last_name, email]
    );
    return result.rows[0];
};

export const updateProfileImage = async (email, imageUrl) => {
  const result = await pool.query(
    `UPDATE users
     SET profile_image = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE email = $2
     RETURNING email, first_name, last_name, profile_image`,
    [imageUrl, email]
  );
  return result.rows[0];
};
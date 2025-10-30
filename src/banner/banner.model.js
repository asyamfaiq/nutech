import pool from '../config/db.js';

export const getAllBanners = async () => {
    const result = await pool.query(
        'SELECT banner_name, banner_image, description FROM banners ORDER BY banner_name ASC'
    );
    return result.rows;
};
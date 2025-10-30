import pool from '../config/db.js';

export const getAllServices = async () => {
    const result = await pool.query(
        `SELECT service_code, service_name, service_icon, service_tariff
        FROM services
        ORDER BY service_name ASC`
    );
    return result.rows;
};

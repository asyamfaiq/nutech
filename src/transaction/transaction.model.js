import pool from '../config/db.js';

export const insertTransaction = async (email, type, description, totalAmount) => {
    const userRes = await pool.query(
        'SELECT user_id FROM users WHERE email = $1',
        [email]
    );
    const userId = userRes.rows[0].user_id;

    const invoiceNumber = `INV${Date.now()}`;
    await pool.query(
        `INSERT INTO transactions (
        user_id, invoice_number, transaction_type, description, total_amount
        ) VALUES ($1, $2, $3, $4, $5)`,
        [userId, invoiceNumber, type, description, totalAmount]
    );

    return invoiceNumber;
};

export const getUserTransactions = async (email, offset = 0, limit = null) => {
    const userRes = await pool.query(
        'SELECT user_id FROM users WHERE email = $1',
        [email]
    );
    const userId = userRes.rows[0].user_id;

    const query = `
        SELECT invoice_number, transaction_type, description, total_amount, created_on
        FROM transactions
        WHERE user_id = $1
        ORDER BY created_on DESC
        ${limit ? 'LIMIT $2 OFFSET $3' : ''}
    `;

    const result = limit
        ? await pool.query(query, [userId, limit, offset])
        : await pool.query(query, [userId]);

    return result.rows;
};

export const getServiceByCode = async (serviceCode) => {
  const result = await pool.query(
    'SELECT service_code, service_name, service_icon, service_tariff FROM services WHERE service_code = $1',
    [serviceCode]
  );
  return result.rows[0] || null;
};
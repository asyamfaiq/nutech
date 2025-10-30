import pool from '../config/db.js';
import { getUserTransactions, getServiceByCode, insertTransaction } from './transaction.model.js';
import { getUserBalance, updateUserBalance, insertBalanceHistory } from '../balance/balance.model.js';


export const getTransactionHistory = async (req, res) => {
    try {
        const email = req.user;
        const offset = parseInt(req.query.offset) || 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const records = await getUserTransactions(email, offset, limit);

        return res.status(200).json({
            status: 0,
            message: 'Get History Berhasil',
            data: {
                offset,
                limit: limit ?? records.length,
                records
            }
        });
    } catch (error) {
        console.error('Error getTransactionHistory:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export const createTransaction = async (req, res) => {
    const client = await pool.connect();
    try {
        const email = req.user;
        const { service_code } = req.body;

        if (!service_code || typeof service_code !== 'string') {
            return res.status(400).json({
                status: 102,
                message: 'Service atau Layanan tidak ditemukan',
                data: null
            });
        }

        const service = await getServiceByCode(service_code);
        if (!service) {
            return res.status(400).json({
                status: 102,
                message: 'Service atau Layanan tidak ditemukan',
                data: null
            });
        }

        const balance = await getUserBalance(email);
        if (!balance) {
            return res.status(404).json({
                status: 404,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        if (Number(balance.balance) < service.service_tariff) {
            return res.status(400).json({
                status: 103,
                message: 'Saldo tidak mencukupi',
                data: null
            });
        }

        await client.query('BEGIN');

        await updateUserBalance(email, -service.service_tariff);

        await insertBalanceHistory(
            email,
            'PAYMENT',
            -service.service_tariff,
            service.service_name
        );

        const invoice_number = await insertTransaction(
            email,
            'PAYMENT',
            service.service_name,
            service.service_tariff
        );

        await client.query('COMMIT');

        return res.status(200).json({
            status: 0,
            message: 'Transaksi berhasil',
            data: {
                invoice_number,
                service_code: service.service_code,
                service_name: service.service_name,
                transaction_type: 'PAYMENT',
                total_amount: service.service_tariff,
                created_on: new Date().toISOString()
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error createTransaction:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    } finally {
        client.release();
    }
};
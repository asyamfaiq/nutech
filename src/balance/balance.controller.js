import { getUserBalance, updateUserBalance, insertBalanceHistory } from './balance.model.js';
import { insertTransaction } from '../transaction/transaction.model.js';


export const getBalance = async (req, res) => {
    try {
        const email = req.user;

        const balance = await getUserBalance(email);
        if (!balance) {
            return res.status(404).json({
                status: 404,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasil',
            data: { balance: Number(balance.balance) }
        });

    } catch (error) {
        console.error('Error getBalance:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export const topUpBalance = async (req, res) => {
    try {
        const email = req.user;
        const { top_up_amount } = req.body;

        if (typeof top_up_amount !== 'number' || isNaN(top_up_amount) || top_up_amount <= 0) {
            return res.status(400).json({
                status: 102,
                message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
                data: null
            });
        }

        const updatedBalance = await updateUserBalance(email, top_up_amount);

        await insertBalanceHistory(email, 'TOPUP', top_up_amount, 'Top Up balance');
        await insertTransaction(email, 'TOPUP', 'Top Up balance', top_up_amount);

        return res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
            data: { balance: Number(updatedBalance.balance) }
        });
    } catch (error) {
        console.error('Error topUpBalance:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};
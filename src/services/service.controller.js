import { getAllServices } from './service.model.js';

export const getServices = async (req, res) => {
    try {
        const services = await getAllServices();

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: services
        });
    } catch (error) {
        console.error('Error getServices:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

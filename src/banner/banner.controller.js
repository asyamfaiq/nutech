import { getAllBanners } from './banner.model.js';

export const getBanners = async (req, res) => {
    try {
        const banners = await getAllBanners();

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banners
        });
    } catch (error) {
        console.error('Error getBanners:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

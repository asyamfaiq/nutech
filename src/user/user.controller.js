import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserByEmail, createUser, getProfileByEmail, updateProfile, updateProfileImage  } from './user.model.js';

dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;

        if (!email || !first_name || !last_name || !password) {
            return res.status(400).json({
                status: 101,
                message: 'Semua field harus diisi',
                data: null
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 102,
                message: 'Paramter email tidak sesuai format',
                data: null
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: 103,
                message: 'Password minimal 8 karakter',
                data: null
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: 104,
                message: 'Email sudah terdaftar',
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser(email, first_name, last_name, hashedPassword);

        return res.status(200).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: null
        });

    } catch (error) {
        console.error('Error register:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 101,
                message: 'Email dan password harus diisi',
                data: null
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 102,
                message: 'Paramter email tidak sesuai format',
                data: null
            });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        return res.status(200).json({
            status: 0,
            message: 'Login Sukses',
            data: { token }
        });
    } catch (error) {
        console.error('Error login:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const email = req.user;

        const profile = await getProfileByEmail(email);
        if (!profile) {
            return res.status(404).json({
                status: 404,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: profile
        });
    } catch (error) {
        console.error('Error getProfile:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export const updateProfileData = async (req, res) => {
    try {
        const email = req.user;
        const { first_name, last_name } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                status: 101,
                message: 'Field first_name dan last_name harus diisi',
                data: null
            });
        }

        const updated = await updateProfile(email, first_name, last_name);
        if (!updated) {
            return res.status(404).json({
                status: 404,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Update Profile berhasil',
            data: updated
        });
    } catch (error) {
        console.error('Error updateProfile:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const email = req.user;

    if (!req.file) {
      return res.status(400).json({
        status: 101,
        message: 'File tidak ditemukan',
        data: null
      });
    }

    const imageUrl = `https://yoururlapi.com/uploads/${req.file.filename}`;

    const updated = await updateProfileImage(email, imageUrl);
    if (!updated) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: updated
    });

  } catch (error) {
    if (error.message === 'Format Image tidak sesuai') {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }

    console.error('Error upload image:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: null
    });
  }
};